// src/controllers/authController.js
const authService = require("../services/authService");
const emailService = require("../services/emailService");
const passwordHelper = require("../utils/passwordHelper"); // Hàm băm mật khẩu bcrypt của bạn

// SỬA TẠI ĐÂY: Giải nén hàm trực tiếp từ Object để tránh lỗi "...is not a function"
const { generateToken, verifyToken } = require("../utils/jwtHelper"); 
const responseHelper = require("../utils/responseHelper"); // Hàm chuẩn hóa phản hồi trả về

/**
 * 🔑 ĐĂNG KÝ TÀI KHOẢN MỚI
 */
const register = async (req, res, next) => {
  try {
    const { ho_ten, email } = req.body;
    
    // SỬA TẠI ĐÂY: Chấp nhận mọi kiểu đặt tên (CamelCase / SnakeCase) từ Frontend gửi lên để sửa lỗi 'so_dien_thoai is required'
    const so_dien_thoai = req.body.so_dien_thoai || req.body.soDienThoai || req.body.regPhone;
    const matKhau = req.body.mat_khau || req.body.password || req.body.regPass;
    const vai_tro = req.body.vai_tro || req.body.role || "customer";

    // Kiểm tra dữ liệu đầu vào bắt buộc ở tầng Controller để an toàn hệ thống
    if (!so_dien_thoai) {
      return res.status(400).json(responseHelper.error("Hệ thống yêu cầu cung cấp Số điện thoại!"));
    }
    if (!matKhau) {
      return res.status(400).json(responseHelper.error("Hệ thống yêu cầu nhập Mật khẩu!"));
    }

    // 1. Kiểm tra tài khoản trùng lặp
    const existingUser = await authService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json(responseHelper.error("Email này đã được đăng ký trên hệ thống!"));
    }

    // 2. Mã hóa mật khẩu bảo mật trước khi lưu
    const hashedPassword = await passwordHelper.hashPassword(matKhau);

    // 3. Khởi tạo tài khoản dữ liệu du lịch vào MongoDB
    await authService.createUser({ 
      ho_ten, 
      email, 
      so_dien_thoai, 
      mat_khau: hashedPassword, 
      vai_tro 
    });

    return res.status(201).json(responseHelper.success(null, "Khởi tạo tài khoản du lịch thành công!"));
  } catch (error) {
    next(error);
  }
};

/**
 * 🔑 ĐĂNG NHẬP PHÂN QUYỀN
 */
const login = async (req, res, next) => {
  try {
    const { email } = req.body;
    const matKhau = req.body.mat_khau || req.body.password;

    // 1. Kiểm tra tài khoản tồn tại
    const user = await authService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json(responseHelper.error("Tài khoản hoặc mật khẩu không chính xác!"));
    }

    // 2. Chặn tài khoản đã bị khóa
    if (user.trang_thai_hoat_dong === false) {
      return res.status(403).json(responseHelper.error("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên!"));
    }

    // 3. Kiểm tra mật khẩu trùng khớp
    const isMatch = await passwordHelper.comparePassword(matKhau, user.mat_khau);
    if (!isMatch) {
      return res.status(401).json(responseHelper.error("Tài khoản hoặc mật khẩu không chính xác!"));
    }

    // 4. Khởi tạo mã token bảo mật JWT (SỬA TẠI ĐÂY: Gọi trực tiếp hàm generateToken đã import ở đầu file)
    const token = generateToken({ id: user._id, vai_tro: user.vai_tro });

    return res.status(200).json({ 
      success: true, 
      message: "Đăng nhập thành công!", 
      token, 
      data: { id: user._id, ho_ten: user.ho_ten, vai_tro: user.vai_tro } 
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 🔑 NGHIỆP VỤ: YÊU CẦU QUÊN MẬT KHẨU
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await authService.findUserByEmail(email);
    if (!user) {
      return res.status(404).json(responseHelper.error("Không tìm thấy tài khoản nào khớp với Email này!"));
    }
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    await authService.saveResetOTP(email, otpCode);
    await emailService.sendOTPResetPasswordMail(email, user.ho_ten, otpCode);
    return res.status(200).json(responseHelper.success(null, "Mã số OTP khôi phục đã được gửi tới Email của bạn!"));
  } catch (error) {
    next(error);
  }
};

/**
 * 🔑 NGHIỆP VỤ: NHẬP OTP XÁC THỰC VÀ ĐẶT LẠI MẬT KHẨU MỚI
 */
const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await authService.verifyResetOTP(email, otp);
    if (!user) {
      return res.status(400).json(responseHelper.error("Mã số OTP không chính xác hoặc đã hết thời gian hiệu lực (5 phút)!"));
    }
    const scrolledPassword = await passwordHelper.hashPassword(newPassword);
    await authService.updateNewPassword(email, scrolledPassword);
    return res.status(200).json(responseHelper.success(null, "Cập nhật mật khẩu mới thành công! Vui lòng đăng nhập lại."));
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, forgotPassword, resetPassword };
