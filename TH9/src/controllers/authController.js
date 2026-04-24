exports.login = (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === '123456') {
        // Trong thực tế sẽ dùng session, ở đây giả lập lưu vào request hoặc trả về token
        // Để đơn giản cho bài thực hành này, ta giả định login đúng
        return res.json({ message: "Đăng nhập thành công!" });
    }
    
    res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu!" });
};

exports.logout = (req, res) => {
    res.json({ message: "Đã đăng xuất!" });
};
