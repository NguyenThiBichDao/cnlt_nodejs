const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let urlData = url.parse(req.url, true);
    let pathname = urlData.pathname;

    // 1. Mặc định vào trang chủ
    if (pathname === '/') pathname = '/index.html';

    // 2. Xác định đường dẫn file (kiểm tra cả trong views và files)
    let fileName = './views' + pathname;
    if (!fs.existsSync(fileName)) {
        fileName = '.' + pathname; // Thử tìm ở thư mục gốc (cho các file như /files/cat.png)
    }

    // 3. Xác định kiểu dữ liệu (Content-Type) dựa trên đuôi file
    const ext = path.extname(fileName).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.txt': 'text/plain'
    };
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    // 4. Đọc và trả về file
    fs.readFile(fileName, (err, data) => {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.write('<h1>404 Not Found</h1>');
            return res.end();
        }
        res.writeHead(200, {'Content-Type': contentType});
        res.end(data);
    });
});

server.listen(8017, 'localhost', () => {
    console.log('Server đang chạy tại http://localhost:8017');
});
