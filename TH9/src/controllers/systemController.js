// ĐÚNG: Chỉ export hàm, không dùng router ở đây
exports.heavySync = (req, res) => {
    console.log("Bắt đầu Sync...");
    for (let i = 0; i < 5e8; i++) {} 
    res.json({ message: "Xong tác vụ đồng bộ!" });
};

exports.heavyAsync = (req, res) => {
    console.log("Bắt đầu Async...");
    setTimeout(() => {
        res.json({ message: "Xong tác vụ bất đồng bộ!" });
    }, 3000);
};
exports.deleteStudent = (req, res) => {
    const { id } = req.params; // Lấy ID từ URL
    const student = students.find(s => s.id === parseInt(id));
    
    if (!student) {
        return res.status(404).json({ message: "Không tìm thấy sinh viên để xóa!" });
    }

    student.isDeleted = true; // Đánh dấu là đã xóa
    res.json({ 
        message: `Đã xóa thành công sinh viên: ${student.name} (Soft Delete)`,
        id: id 
    });
};