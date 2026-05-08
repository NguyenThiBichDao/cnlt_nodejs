const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let users = {}; // Lưu trữ: { socketId: username }

io.on('connection', (socket) => {
    // Khi user nhập tên và tham gia
    socket.on('register-user', (username) => {
        users[socket.id] = username;
        // Gửi danh sách cho tất cả mọi người
        io.emit('update-user-list', Object.values(users));
        console.log(`${username} đã tham gia.`);
    });

    // Xử lý gửi tin nhắn riêng
    socket.on('private-message', ({ to, message }) => {
        const targetSocketId = Object.keys(users).find(key => users[key] === to);
        if (targetSocketId) {
            io.to(targetSocketId).emit('receive-message', {
                sender: users[socket.id],
                message: message,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
        }
    });

    // Khi user thoát hoặc mất kết nối
    socket.on('disconnect', () => {
        if (users[socket.id]) {
            console.log(`${users[socket.id]} đã thoát.`);
            delete users[socket.id];
            // Cập nhật lại danh sách online cho những người còn lại ngay lập tức
            io.emit('update-user-list', Object.values(users));
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));
