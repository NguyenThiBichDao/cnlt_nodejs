const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// Cấu hình lưu trữ file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // File sẽ lưu vào thư mục này
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Route hiển thị giao diện từ file master.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'master.html'));
});

// Route xử lý khi nhấn nút Upload
app.post('/upload', upload.single('myFile'), (req, res) => {
    if (!req.file) {
        return res.send('Bạn chưa chọn file nào!');
    }
    res.send('Upload file thành công! Kiểm tra thư mục uploads nhé.');
});

app.listen(8017, '0.0.0.0', () => {
    console.log('Server đang chạy tại http://localhost:8017');
});
