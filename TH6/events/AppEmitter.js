// events/AppEmitter.js (Gợi ý nếu bạn chưa viết xong)
const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

class AppEmitter extends EventEmitter {
    log(message) {
        this.emit('logEvent', message);
    }
}

const myEmitter = new AppEmitter();

// Lắng nghe sự kiện để ghi vào data/log.txt
myEmitter.on('logEvent', (msg) => {
    const logMsg = `[${new Date().toLocaleString()}] - ${msg}\n`;
    fs.appendFileSync(path.join(__dirname, '../data/log.txt'), logMsg);
});

module.exports = myEmitter;
