const express = require('express');
const app = express();
const path = require('path');

// 1. Cấu hình View Engine là EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 2. Cấu hình thư mục chứa tài nguyên tĩnh (CSS, JS, Ảnh)
app.use(express.static(path.join(__dirname, 'public')));

// 3. Khai báo mảng dữ liệu (Tối thiểu 5 phần tử theo yêu cầu)
const items = [
    { id: 1, name: 'Địa điểm A', hot: true },
    { id: 2, name: 'Địa điểm B', hot: false },
    { id: 3, name: 'Địa điểm C', hot: true },
    { id: 4, name: 'Địa điểm D', hot: false },
    { id: 5, name: 'Địa điểm E', hot: true }
];

// --- CÁC ROUTE CỦA WEBSITE ---

// Route 1: Trang chủ (/)
app.get('/', (req, res) => {
    // Truyền mảng dữ liệu sang để trang chủ có thể hiển thị nếu cần
    res.render('index', { dsDiaDiem: items });
});

// Route 2: Trang danh sách (/list)
app.get('/list', (req, res) => {
    res.render('list', { dsDiaDiem: items });
});

// Route 3: Trang chi tiết động (/detail/:id)
app.get('/detail/:id', (req, res) => {
    const id = req.params.id; // Lấy ID từ thanh địa chỉ URL
    const item = items.find(i => i.id == id); // Tìm địa điểm có ID khớp
    
    if (item) {
        res.render('detail', { item: item }); // Nếu thấy, hiển thị trang detail
    } else {
        res.status(404).send("<h1>Lỗi 404: Không tìm thấy địa điểm này!</h1>");
    }
});

// Route 4: Trang liên hệ (/contact)
app.get('/contact', (req, res) => {
    res.render('contact');
});

// 4. Khởi chạy Server ở cổng 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`----------------------------------------------`);
    console.log(`Server đang chạy tại: http://localhost:${PORT}`);
    console.log(`Nhấn Ctrl + C để dừng Server.`);
    console.log(`----------------------------------------------`);
});
