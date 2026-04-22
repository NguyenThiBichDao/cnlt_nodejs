const express = require('express');
const session = require('express-session');
const app = express();

// Import các routes (đảm bảo bạn đã tạo 3 file này trong thư mục routes)
const studentRoutes = require('./routes/studentRoutes');
const systemRoutes = require('./routes/systemRoutes');
const authRoutes = require('./routes/authRoutes');


app.use(express.json());
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

// Kết nối các đầu API
app.use('/students', studentRoutes); // Bài 1 & 5
app.use('/', systemRoutes);          // Bài 2 (/sync, /async)
app.use('/', authRoutes);            // Bài 3 (/login, /logout...)

const PORT = 3000;
app.listen(PORT, () => console.log(`Server đang chạy tại http://localhost:${PORT}`));
