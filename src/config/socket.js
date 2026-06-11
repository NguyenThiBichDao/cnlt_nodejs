const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const chatService = require('../services/chatService');
const User = require('../models/userModel');

const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: true,
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(new Error('Authentication required'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch (error) {
            next(new Error('Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        const user = socket.user;
        if (!user?.id) {
            return socket.disconnect(true);
        }

        socket.join(`user_${user.id}`);
        if (user.role === 'admin') {
            socket.join('admin_room');
        }

        socket.on('send-message', async (payload) => {
            try {
                let { to, message } = payload;
                if (!message || message.trim().length === 0) {
                    return;
                }

                if (!to && user.role === 'customer') {
                    const admin = await chatService.getDefaultAdmin();
                    if (!admin) {
                        return;
                    }
                    to = admin._id.toString();
                }

                const receiverRole = user.role === 'admin' ? 'customer' : 'admin';
                const saved = await chatService.saveMessage({
                    from: user.id,
                    to,
                    message,
                    senderRole: user.role,
                    receiverRole
                });

                const eventData = {
                    _id: saved._id,
                    from: saved.from,
                    to: saved.to,
                    message: saved.message,
                    senderRole: saved.senderRole,
                    receiverRole: saved.receiverRole,
                    createdAt: saved.createdAt
                };

                socket.emit('message-sent', eventData);
                socket.to(`user_${to}`).emit('receive-message', eventData);

                if (user.role === 'customer') {
                    socket.to('admin_room').emit('receive-message', eventData);
                }
            } catch (error) {
                console.error('Socket send-message error:', error.message);
            }
        });

        socket.on('typing', ({ to, isTyping }) => {
            if (!to) return;
            socket.to(`user_${to}`).emit('typing', {
                from: user.id,
                isTyping,
                senderRole: user.role
            });
        });

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id} (${user.id})`);
        });
    });

    return io;
};

module.exports = setupSocket;