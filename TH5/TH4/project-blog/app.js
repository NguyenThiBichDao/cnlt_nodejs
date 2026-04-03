const express = require('express');
const app = express();

// 1. Kết nối Database
require('./config/db');

// 2. Middleware & View Engine
app.set('view engine', 'ejs'); // THÊM DÒNG NÀY ĐỂ CHẠY ĐƯỢC FILE .EJS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); 

// 3. Sử dụng Routes đã tách
const postRoutes = require('./routes/postRoutes');
app.use(postRoutes);

// 4. Chạy Server
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
