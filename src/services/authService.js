// src/services/authService.js
const User = require("../models/userModel");
 
/**
 * Tìm kiếm người dùng dựa vào địa chỉ Email
 */
const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};
 
/**
 * Khởi tạo tài khoản khách hàng mới
 */
const createUser = async (data) => {
    return await User.create(data);
};
 
/**
 * Lưu mã OTP khôi phục mật khẩu vào MongoDB kèm thời hạn 5 phút.
 * @param {string} email - Email của khách hàng cần khôi phục
 * @param {string} otpCode - Mã OTP ngẫu nhiên gồm 6 chữ số
 */
const saveResetOTP = async (email, otpCode) => {
    const expiresTime = new Date(Date.now() + 5 * 60 * 1000);
 
    return await User.findOneAndUpdate(
        { email },
        {
            ma_otp: otpCode,
            ma_otp_het_han: expiresTime
        },
        { new: true }
    );
};
 
/**
 * Xác thực mã OTP do khách hàng nhập từ giao diện.
 * @param {string} email - Email cần kiểm tra
 * @param {string} otpCode - Mã OTP khách nhập vào form
 */
const verifyResetOTP = async (email, otpCode) => {
    return await User.findOne({
        email,
        ma_otp: otpCode,
        ma_otp_het_han: { $gt: Date.now() } // Mã còn trong thời gian hiệu lực
    });
};
 
/**
 * Cập nhật mật khẩu mới và xóa sạch dữ liệu OTP tạm thời.
 * @param {string} email - Email tài khoản khách
 * @param {string} hashedNewPassword - Mật khẩu mới ĐÃ được mã hóa bằng bcrypt
 */
const updateNewPassword = async (email, hashedNewPassword) => {
    return await User.findOneAndUpdate(
        { email },
        {
            mat_khau: hashedNewPassword,
            ma_otp: null,
            ma_otp_het_han: null
        },
        { new: true }
    );
};
 
module.exports = {
    findUserByEmail,
    createUser,
    saveResetOTP,
    verifyResetOTP,
    updateNewPassword
};