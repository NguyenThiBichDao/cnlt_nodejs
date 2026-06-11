// src/middleware/roleMiddleware.js
const responseHelper = require("../utils/responseHelper");

/**
 * Middleware phân quyền truy cập API dựa trên vai trò (Role)
 * @param  {...string} roles - Danh sách các quyền được phép truy cập (Ví dụ: 'admin', 'customer')
 */
const restrictTo = (...roles) => {
    return (req, res, next) => {
        // req.user được nạp từ authMiddleware sau khi xác thực Token thành công
        // Nếu trường vai trò trong userModel của bạn tên là vai_tro, hãy sửa thành req.user.vai_tro
        const userRole = req.user && (req.user.vai_tro || req.user.role);

        if (!roles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: "⛔ Bạn không có quyền thực hiện hành động này!"
            });
        }

        next();
    };
};

// Đảm bảo xuất khẩu dưới dạng một đối tượng chứa hàm để file Route nhận diện chính xác
module.exports = {
    restrictTo
};

