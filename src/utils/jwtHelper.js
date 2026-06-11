const jwt = require("jsonwebtoken");

// 1. Hàm tạo mã token mới khi đăng nhập thành công
const generateToken = (payload) => {
  return jwt.sign(
    payload, 
    process.env.JWT_SECRET || 'secret_key_mac_dinh', 
    { expiresIn: "1d" } // Token có hiệu lực trong 1 ngày
  );
};

// 2. Hàm kiểm tra mã token cũ (giữ nguyên của bạn)
const verifyToken = (token) => {
  return jwt.verify(
    token, 
    process.env.JWT_SECRET || 'secret_key_mac_dinh'
  );
};

// Xuất cả 2 hàm ra ngoài để các file khác sử dụng
module.exports = { 
  generateToken, 
  verifyToken 
};
