const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);

// Cấu hình Socket.io nhận dữ liệu lớn (cho ảnh/sticker)
const io = new Server(server, {
    maxHttpBufferSize: 1e8 // 100MB
});

// 1. Kết nối MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/chat_app')
    .then(() => console.log("✅ Đã kết nối MongoDB thành công!"))
    .catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));

// 2. Schema Tin nhắn
const MessageSchema = new mongoose.Schema({
    sender: String,
    to: String,
    message: String,
    time: String,
    status: { type: String, default: '✓ Đã gửi' }, // Thêm trạng thái mặc định
    timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', MessageSchema);

app.use(express.static('public'));

let users = {}; // { socketId: username }

io.on('connection', (socket) => {
    console.log('Một kết nối mới:', socket.id);

    // Khi user đăng ký
    socket.on('register-user', async (username) => {
        users[socket.id] = username;
        try {
            const history = await Message.find({
                $or: [{ sender: username }, { to: username }]
            }).sort({ timestamp: 1 });
            
            socket.emit('load-history', history);
            io.emit('update-user-list', Object.values(users));
        } catch (err) {
            console.error("Lỗi tải lịch sử:", err);
        }
    });

    // Xử lý gửi tin nhắn riêng
    socket.on('private-message', async (data) => {
        try {
            const newMessage = new Message({
                sender: data.sender,
                to: data.to,
                message: data.message,
                time: data.time,
                status: '✓ Đã gửi'
            });
            await newMessage.save();

            const targetSocketId = Object.keys(users).find(key => users[key] === data.to);
            if (targetSocketId) {
                // Gửi kèm _id để Client xác nhận trạng thái sau này
                io.to(targetSocketId).emit('receive-message', { ...data, _id: newMessage._id });
            }
        } catch (err) {
            console.error("Lỗi lưu tin nhắn:", err);
        }
    });

    // XỬ LÝ: Đã nhận / Đã xem (Cập nhật linh hoạt)
    socket.on('msg-received', async ({ msgId, senderName, status }) => {
        try {
            // Cập nhật trạng thái vào Database
            await Message.findByIdAndUpdate(msgId, { status: status });

            const senderSocketId = Object.keys(users).find(key => users[key] === senderName);
            if (senderSocketId) {
                // Báo cho người gửi cập nhật giao diện
                io.to(senderSocketId).emit('update-status', { msgId, status });
            }
        } catch (err) {
            console.error("Lỗi cập nhật trạng thái:", err);
        }
    });

    // Trạng thái đang gõ chữ
    socket.on('typing', ({ to, isTyping }) => {
        const targetSocketId = Object.keys(users).find(key => users[key] === to);
        if (targetSocketId) {
            io.to(targetSocketId).emit('display-typing', {
                sender: users[socket.id],
                isTyping: isTyping
            });
        }
    });

    socket.on('update-user-list-trigger', () => {
        io.emit('update-user-list', Object.values(users));
    });

    socket.on('disconnect', () => {
        if (users[socket.id]) {
            console.log(users[socket.id], 'đã thoát.');
            delete users[socket.id];
            io.emit('update-user-list', Object.values(users));
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
