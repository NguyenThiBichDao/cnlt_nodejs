const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === '123456') {
        req.session.user = username;
        return res.json({ msg: "Đăng nhập thành công" });
    }
    res.status(400).json({ msg: "Sai tài khoản" });
});

router.get('/profile', (req, res) => {
    if (!req.session.user) return res.status(401).json({ msg: "Chưa đăng nhập" });
    res.json({ user: req.session.user });
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.json({ msg: "Đã đăng xuất" });
});

module.exports = router;
