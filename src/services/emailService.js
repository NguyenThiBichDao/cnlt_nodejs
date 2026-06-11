const sendEmail = require("../utils/emailHelper");

const sendOTPResetPasswordMail = async (email, hoTen, otpCode) => {
    const subject = "🔑 MÃ OTP KHÔI PHỤC MẬT KHẨU - HỆ THỐNG THUÊ XE MÁY";
    const content = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ff5722; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #ff5722; color: white; padding: 20px; text-align: center;">
                <h2 style="margin: 0; font-size: 22px;">HỆ THỐNG THUÊ XE MÁY DU LỊCH</h2>
            </div>
            <div style="padding: 30px; background-color: #ffffff; color: #333333; line-height: 1.6;">
                <p>Xin chào <strong>${hoTen}</strong>,</p>
                <p>Chúng tôi đã nhận được yêu cầu khôi phục mật khẩu tài khoản của bạn trên hệ thống đặt xe máy du lịch.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <p style="font-size: 14px; color: #777777; margin-bottom: 5px;">Mã OTP xác thực của bạn là:</p>
                    <span style="display: inline-block; background-color: #fff3e0; color: #e64a19; font-size: 32px; font-weight: bold; padding: 10px 30px; border: 2px dashed #ff5722; border-radius: 5px; letter-spacing: 5px;">
                        ${otpCode}
                    </span>
                    <p style="font-size: 13px; color: #d32f2f; margin-top: 10px; font-style: italic;">
                        * Mã OTP này có hiệu lực trong vòng 5 phút. Tuyệt đối không chia sẻ mã này cho bất kỳ ai!
                    </p>
                </div>
                <p>Nếu bạn không đưa ra yêu cầu này, vui lòng bỏ qua email này hoặc liên hệ ngay với tổng đài hỗ trợ của chúng tôi.</p>
                <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;">
                <p style="font-size: 12px; color: #999999; text-align: center;">
                    Trụ sở: 123 Đường Nguyễn Huệ, Thành phố Quy Nhơn<br>
                    Hotline hỗ trợ: 1900 xxxx (24/7)
                </p>
            </div>
        </div>
    `;

    return await sendEmail(email, subject, content);
};

const sendRentalStatusUpdateMail = async (email, hoTen, status) => {
    const statusLabel = {
        approved: 'đã được duyệt',
        rejected: 'đã bị từ chối',
        cancelled: 'đã bị hủy',
        ongoing: 'đang diễn ra',
        completed: 'đã hoàn tất'
    }[status] || status;

    const subject = `📣 CẬP NHẬT TRẠNG THÁI ĐƠN THUÊ XE - ${statusLabel.toUpperCase()}`;
    const content = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #2196f3; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #2196f3; color: white; padding: 20px; text-align: center;">
                <h2 style="margin: 0; font-size: 22px;">CẬP NHẬT ĐƠN THUÊ XE MÁY</h2>
            </div>
            <div style="padding: 30px; background-color: #ffffff; color: #333333; line-height: 1.6;">
                <p>Xin chào <strong>${hoTen}</strong>,</p>
                <p>Đơn thuê xe của bạn ${statusLabel}.</p>
                <p>Trạng thái hiện tại của đơn: <strong style="color: #1976d2;">${statusLabel}</strong></p>
                <p>Nếu bạn có thắc mắc về đơn thuê, vui lòng trả lời email này hoặc liên hệ với bộ phận hỗ trợ của chúng tôi.</p>
                <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;">
                <p style="font-size: 12px; color: #999999; text-align: center;">
                    Cảm ơn bạn đã sử dụng dịch vụ thuê xe máy du lịch của chúng tôi.
                </p>
            </div>
        </div>
    `;

    return await sendEmail(email, subject, content);
};

module.exports = {
    sendOTPResetPasswordMail,
    sendRentalStatusUpdateMail
};
