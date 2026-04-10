const { Duplex } = require('stream');

class EchoDuplex extends Duplex {
    constructor(options) {
        super(options);
        this.buffer = [];
    }

    // Nhận dữ liệu từ phía Client gửi lên
    _write(chunk, encoding, callback) {
        const data = chunk.toString();
        // Thêm tiền tố để chứng minh nó đã đi qua stream này
        this.buffer.push(`[ECHO]: ${data}`);
        callback();
    }

    // Trả dữ liệu ngược lại cho Client
    _read(size) {
        while (this.buffer.length > 0) {
            const chunk = this.buffer.shift();
            if (!this.push(chunk)) break;
        }
        this.push(null); // Kết thúc việc đọc
    }
}

module.exports = EchoDuplex;
