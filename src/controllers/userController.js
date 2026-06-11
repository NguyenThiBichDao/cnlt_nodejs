const userService = require('../services/userService');

exports.getAllUsers = async (req, res) => {
    try {
        const danhSachUser = await userService.getUsers();
        res.status(200).json({ success: true, data: danhSachUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userService.toggleUserStatus(id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng!' });
        }

        res.status(200).json({ success: true, message: 'Cập nhật trạng thái tài khoản thành công!', data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
