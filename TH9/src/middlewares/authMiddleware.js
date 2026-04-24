module.exports = (req, res, next) => {
    // Giả sử bạn dùng một header đơn giản hoặc session để kiểm tra
    // Ở đây mình làm mẫu kiểm tra một header 'Authorization'
    const auth = req.headers['authorization'];
    
    if (auth === 'SecretToken') {
        next();
    } else {
        res.status(401).json({ message: "Bạn cần đăng nhập để truy cập API này!" });
    }
};
