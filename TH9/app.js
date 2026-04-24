const express = require('express');
const path = require('path');
const app = express();

// 1. Middlewares cơ bản
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // Thêm cái này để hỗ trợ nhiều kiểu gửi form hơn

// 2. Phục vụ file tĩnh (CSS, Giao diện)
app.use(express.static(path.join(__dirname, 'public')));

// 3. Import các Route
const studentRoutes = require('./src/routes/studentRoutes');
const authRoutes = require('./src/routes/authRoutes');
const systemRoutes = require('./src/routes/systemRoutes');

// 4. Gắn các Route vào Server
app.use('/api', studentRoutes);
app.use('/api', authRoutes);
app.use('/', systemRoutes);

// 5. Route mặc định để mở trang giao diện chính
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 6. Middleware xử lý lỗi chung (Luôn để cuối cùng)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Đã có lỗi xảy ra trên server!" });
});

// 7. Khởi động Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy mượt mà tại http://localhost:${PORT}`);
});
