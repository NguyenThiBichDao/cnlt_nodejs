const http = require('http');

const server = http.createServer((req, res) => {
    // Lấy đường dẫn người dùng truy cập
    const url = req.url;

    // Thiết lập Header chung cho tiếng Việt
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });

    // Kiểm tra Routing bằng Switch-Case hoặc If-Else
    if (url === '/') {
        res.end('Trang chủ');
    } 
    else if (url === '/about') {
        res.end('Trang giới thiệu');
    } 
    else if (url === '/contact') {
        res.end('Trang liên hệ');
    } 
    else {
        // Trường hợp không khớp đường dẫn nào -> Trả về lỗi 404
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Không tìm thấy trang');
    }
});

// Chạy server tại port 3000
server.listen(3000, () => {
    console.log('Server đang chạy tại http://localhost:3000');
});
