const jwtHelper = require("../utils/jwtHelper");
const responseHelper = require("../utils/responseHelper");

/**
 * Middleware xác thực: kiểm tra token JWT trong header Authorization.
 * Nếu hợp lệ thì gắn thông tin người dùng đã giải mã vào req.user.
 */
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json(
                responseHelper.error("Không có token xác thực!")
            );
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwtHelper.verifyToken(token);

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json(
            responseHelper.error("Token không hợp lệ hoặc đã hết hạn!")
        );
    }
};

module.exports = authMiddleware;