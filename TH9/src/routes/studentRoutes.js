const express = require('express');
const router = express.Router();

let students = [
    { id: 1, name: "Nguyen Van A", email: "a@gmail.com" },
    { id: 2, name: "Tran Thi B", email: "b@gmail.com" }
];

// GET /students (Phân trang + Tìm kiếm)
router.get('/', (req, res) => {
    let result = [...students];
    const { name, page, limit } = req.query;

    if (name) result = result.filter(s => s.name.toLowerCase().includes(name.toLowerCase()));
    if (page && limit) {
        const start = (parseInt(page) - 1) * parseInt(limit);
        result = result.slice(start, start + parseInt(limit));
    }
    res.json(result);
});

// POST /students (Thêm + Validate)
router.post('/', (req, res) => {
    const { name, email } = req.body;
    if (!name || name.length < 2) return res.status(400).json({ msg: "Tên không hợp lệ" });
    if (students.find(s => s.email === email)) return res.status(400).json({ msg: "Email trùng" });

    const newStudent = { id: Date.now(), name, email };
    students.push(newStudent);
    res.status(201).json(newStudent);
});

module.exports = router;
