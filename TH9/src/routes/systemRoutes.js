const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/sync', (req, res) => {
    console.log("Start Sync");
    // Vì bạn đã cd vào TH9 nên chỉ cần 'test.txt'
    const data = fs.readFileSync('test.txt', 'utf8'); 
    console.log("End Sync");
    res.send(data);
});

router.get('/async', (req, res) => {
    console.log("Start Async");
    fs.readFile('test.txt', 'utf8', (err, data) => {
        if (err) return res.status(500).send("Không tìm thấy file test.txt");
        console.log("Done Async");
        res.send(data);
    });
    console.log("Tiếp tục chạy trong khi đang đọc file...");
});

module.exports = router;
