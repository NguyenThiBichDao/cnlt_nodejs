const { Transform } = require('stream');

/**
 * Class TextTransform kế thừa từ Transform stream
 * Dùng để biến đổi dữ liệu văn bản đầu vào
 */
class TextTransform extends Transform {
    constructor(options) {
        super(options);
    }

    /**
     * Phương thức _transform xử lý logic biến đổi dữ liệu
     * @param {Buffer} chunk - Khối dữ liệu nhận được từ stream nguồn (ví dụ: từ Request)
     * @param {String} encoding - Kiểu mã hóa
     * @param {Function} callback - Hàm gọi sau khi xử lý xong khối dữ liệu hiện tại
     */
    _transform(chunk, encoding, callback) {
        try {
            // Chuyển khối dữ liệu (Buffer) sang String
            let data = chunk.toString();

            // Thực hiện biến đổi: Chuyển toàn bộ sang chữ in hoa
            let transformedData = data.toUpperCase();

            // Đẩy dữ liệu đã biến đổi sang stream đích (ví dụ: ghi vào file hoặc trả về Client)
            this.push(transformedData);

            // Hoàn tất xử lý khối này
            callback();
        } catch (error) {
            // Gửi lỗi nếu có vấn đề trong quá trình biến đổi
            callback(error);
        }
    }
}

module.exports = TextTransform;
