const students = require('../../data/students');

// 1. Lấy danh sách sinh viên (Active)
exports.getAllStudents = (req, res) => {
    const activeStudents = students.filter(s => !s.isDeleted);
    res.json(activeStudents);
};

// 2. Thêm sinh viên mới (Có Validation - Giữ bản này)
exports.addStudent = (req, res) => {
    const { name, age, class: className } = req.body;
    
    // Kiểm tra dữ liệu đầu vào
    if (!name || name.length < 2) {
        return res.status(400).json({ message: "Tên phải ít nhất 2 ký tự" });
    }
    if (!age || age < 16 || age > 60) {
        return res.status(400).json({ message: "Tuổi phải từ 16 đến 60" });
    }

    const newStudent = {
        id: students.length > 0 ? students[students.length - 1].id + 1 : 1,
        name,
        // Tạo email không trùng bằng cách thêm timestamp
        email: `${name.toLowerCase().replace(/\s/g, '')}${Date.now()}@student.com`, 
        age: parseInt(age),
        class: className,
        isDeleted: false
    };

    students.push(newStudent);
    res.status(201).json(newStudent);
};

// 3. Thống kê tổng quan
exports.getStats = (req, res) => {
    const activeStudents = students.filter(s => !s.isDeleted);
    const total = students.length;
    const active = activeStudents.length;
    const deleted = total - active;
    
    const averageAge = active > 0 
        ? activeStudents.reduce((sum, s) => sum + s.age, 0) / active 
        : 0;

    res.json({ total, active, deleted, averageAge: averageAge.toFixed(2) }); // Làm tròn 2 chữ số cho đẹp
};
exports.deleteStudent = (req, res) => {
    const { id } = req.params;
    const student = students.find(s => s.id === parseInt(id));
    
    if (!student) return res.status(404).json({ message: "Không tìm thấy sinh viên" });

    student.isDeleted = true; // Soft Delete: chỉ đánh dấu, không xóa khỏi mảng
    res.json({ message: "Đã xóa sinh viên thành công (Soft Delete)", id });
};

// 4. Thống kê theo lớp
exports.getStatsByClass = (req, res) => {
    const stats = students.reduce((acc, s) => {
        if (!s.isDeleted) {
            acc[s.class] = (acc[s.class] || 0) + 1;
        }
        return acc;
    }, {});
    
    const result = Object.keys(stats).map(className => ({
        class: className,
        count: stats[className]
    }));
    
    res.json(result);
};
