const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const querystring = require('querystring'); // Thêm module này để xử lý dữ liệu form

// Import các module từ thư mục của bạn
const appEmitter = require('./events/AppEmitter');
const TextTransform = require('./streams/TextTransform');
const EchoDuplex = require('./streams/EchoDuplex');

const PORT = 3000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    // --- TIỆN ÍCH: Render HTML từ thư mục views ---
    const renderHTML = (fileName) => {
        const filePath = path.join(__dirname, 'views', fileName);
        if (fs.existsSync(filePath)) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            fs.createReadStream(filePath).pipe(res);
        } else {
            res.writeHead(404);
            res.end(`Lỗi: Không tìm thấy file ${fileName} trong thư mục views/`);
        }
    };

    // --- 1. PHỤC VỤ FILE TĨNH (CSS & IMAGE) ---

    if (pathname === '/style.css') {
        const cssPath = path.join(__dirname, 'public', 'style.css');
        if (fs.existsSync(cssPath)) {
            res.writeHead(200, { 'Content-Type': 'text/css' });
            fs.createReadStream(cssPath).pipe(res);
        } else {
            res.writeHead(404);
            res.end('Not Found');
        }
        return;
    }

      
    if (pathname === '/image') {
        const id = parsedUrl.query.id || '1';
        const imagesDir = path.join(__dirname, 'public', 'images');
        
        // Đọc tất cả các file trong thư mục images
        const files = fs.readdirSync(imagesDir);
        
        // Tìm file nào BẮT ĐẦU bằng số id và KHÔNG PHẢI file Zone.Identifier
        const targetFile = files.find(f => f.startsWith(id) && !f.includes(':'));

        if (targetFile) {
            const imgPath = path.join(imagesDir, targetFile);
            const ext = path.extname(targetFile).toLowerCase();
            
            // Thiết lập Header đúng loại ảnh
            const contentType = (ext === '.png') ? 'image/png' : 'image/jpeg';
            res.writeHead(200, { 'Content-Type': contentType });
            
            // Stream ảnh về trình duyệt
            fs.createReadStream(imgPath).pipe(res);
        } else {
            res.writeHead(404);
            res.end();
        }
        return;
    }


    // --- 2. ĐIỀU HƯỚNG CÁC TRANG CHÍNH ---

    if (pathname === '/' && method === 'GET') {
        appEmitter.log('Người dùng xem Trang Chủ');
        renderHTML('index.html');
    }

    // Trang Events: Xử lý cả hiển thị và thêm mới địa điểm
    else if (pathname === '/events') {
        if (method === 'GET') {
            appEmitter.log('Người dùng truy cập trang Khám Phá');
            renderHTML('events.html');
        } 
        else if (method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
                const formData = querystring.parse(body);
                const place = formData.place || 'Địa điểm ẩn danh';
                
                // Writable Stream: Ghi địa điểm mới vào locations.txt
                const logEntry = `📍 ${place} - Check-in: ${new Date().toLocaleString()}\n`;
                const writer = fs.createWriteStream(path.join(__dirname, 'data', 'locations.txt'), { flags: 'a' });
                writer.write(logEntry);
                writer.end();

                // EventEmitter: Log vào file hệ thống
                appEmitter.log(`Đã thêm địa điểm mới: ${place}`);

                // Quay lại trang events sau khi thêm
                res.writeHead(302, { 'Location': '/events' });
                res.end();
            });
        }
    }

    else if (pathname === '/request' && method === 'GET') {
        appEmitter.log('Người dùng xem trang Thông Tin Request');
        res.setHeader('X-Powered-By', 'NodeJS-Raw-Server');
        renderHTML('request.html');
    }

        else if (pathname === '/streams') {
          appEmitter.log('Người dùng truy cập trang Nhật Ký (Streams)');   
        if (method === 'GET') {
            renderHTML('streams.html');
        } 
        else if (method === 'POST') {
            let body = '';
            // Hứng dữ liệu từ Form gửi lên
            req.on('data', chunk => { body += chunk.toString(); });
            
            req.on('end', () => {
                // Giải mã dữ liệu form (bỏ STORY= và các ký tự loằng ngoằng)
                const formData = querystring.parse(body);
                const content = formData.content || ''; // 'content' phải khớp với name của textarea trong HTML

                if (content) {
                    const transformer = new TextTransform();
                    const writer = fs.createWriteStream(path.join(__dirname, 'data', 'story.txt'), { flags: 'a' });

                    // Ghi nội dung đã sạch vào Transform stream để VIẾT HOA rồi ghi vào file
                    transformer.pipe(writer);
                    transformer.write(content + '\n'); // Thêm dấu xuống dòng cho đẹp
                    transformer.end();
                }

                // Trả về thông báo thành công
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('<h3>✅ Nhật ký đã được lưu sạch sẽ!</h3><a href="/streams">Quay lại trang Nhật Ký</a>');
            });
        }
    }


    // --- 3. CÁC ENDPOINT CHỨC NĂNG ---

    // Readable Stream: Hiển thị danh sách địa điểm đã lưu
    else if (pathname === '/get-locations') {
        const locPath = path.join(__dirname, 'data', 'locations.txt');
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        if (fs.existsSync(locPath)) {
            fs.createReadStream(locPath).pipe(res);
        } else {
            res.end('Chưa có địa điểm nào được khám phá.');
        }
    }

    else if (pathname === '/json') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            url: req.url,
            headers: req.headers,
            query: parsedUrl.query
        }, null, 4));
    }

    else if (pathname === '/download-log') {
        res.writeHead(200, {
            'Content-Type': 'text/plain',
            'Content-Disposition': 'attachment; filename=log_hanh_trinh.txt'
        });
        fs.createReadStream(path.join(__dirname, 'data', 'log.txt')).pipe(res);
    }

    else if (pathname === '/echo' && method === 'POST') {
        const echo = new EchoDuplex();
        req.pipe(echo).pipe(res);
    }

    else if (pathname === '/read-story') {
        const storyFile = path.join(__dirname, 'data', 'story.txt');
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        if (fs.existsSync(storyFile)) {
            fs.createReadStream(storyFile).pipe(res);
        } else {
            res.end('Nhật ký đang trống...');
        }
    }

    else {
        res.writeHead(404);
        res.end('404 Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`\n🚀 Server Travel Blog đang chạy tại: http://localhost:${PORT}`);
});
