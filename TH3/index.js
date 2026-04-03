const express = require('express');
const app = express();
const path = require('path');

// 1. Cấu hình View Engine là EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 2. Cấu hình thư mục chứa tài nguyên tĩnh (CSS, JS, Ảnh)
app.use(express.static(path.join(__dirname, 'public')));

// 3. Khai báo mảng dữ liệu (Đúng 5 phần tử như cũ)
const items = [
    { id: 1, name: 'Sản phẩm A', hot: true },
    { id: 2, name: 'Sản phẩm B', hot: false },
    { id: 3, name: 'Sản phẩm C', hot: true },
    { id: 4, name: 'Sản phẩm D', hot: false },
    { id: 5, name: 'Sản phẩm E', hot: true }
];

// --- CÁC ROUTE CỦA WEBSITE ---

// Route 1: Trang chủ (/)
app.get('/', (req, res) => {
    // Truyền mảng dữ liệu sang với tên biến dsSanPham để khớp với EJS
    res.render('index', { dsSanPham: items });
});

// Route 2: Trang danh sách (/list)
app.get('/list', (req, res) => {
    res.render('list', { dsSanPham: items });
});

// Route 3: Trang chi tiết động (/detail/:id)
app.get('/detail/:id', (req, res) => {
    const id = req.params.id; 
    const item = items.find(i => i.id == id); 
    
    if (item) {
        res.render('detail', { item: item }); 
    } else {
        res.status(404).send("<h1>Lỗi 404: Không tìm thấy sản phẩm này!</h1>");
    }
});

// Route 4: Trang liên hệ (/contact)
app.get('/contact', (req, res) => {
    res.render('contact');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});
