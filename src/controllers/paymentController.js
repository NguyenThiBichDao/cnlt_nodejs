const paymentService = require('../services/paymentService');
const rentalService = require('../services/rentalService');
const responseHelper = require('../utils/responseHelper');

const createPayment = async (req, res) => {
    try {
        const { id_don_thue, so_tien_thanh_toan, phuong_thuc_thanh_toan, ma_giao_dich_ngan_hang } = req.body;

        const rental = await rentalService.getRentalById(id_don_thue);
        if (!rental) {
            return res.status(404).json(responseHelper.error('Không tìm thấy đơn thuê xe'));
        }

        const paymentData = {
            id_don_thue,
            so_tien_thanh_toan,
            phuong_thuc_thanh_toan,
            ma_giao_dich_ngan_hang,
            trang_thai_giao_dich: 'paid'
        };

        const hoaDonMoi = await paymentService.createPayment(paymentData);
        await rentalService.markRentalAsPaid(id_don_thue);

        res.status(201).json({ success: true, message: 'Thanh toán hóa đơn hoàn tất!', data: hoaDonMoi });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllPayments = async (req, res) => {
    try {
        const payments = await paymentService.getPayments(req.user?.id, req.user?.role);
        res.status(200).json(responseHelper.success(payments));
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { trang_thai_giao_dich } = req.body;

        const hoaDonCapNhat = await paymentService.updatePaymentStatus(id, trang_thai_giao_dich);
        if (!hoaDonCapNhat) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy hóa đơn yêu cầu!' });
        }

        res.status(200).json({ success: true, message: 'Cập nhật trạng thái tài chính thành công!', data: hoaDonCapNhat });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createPayment,
    getAllPayments,
    updatePaymentStatus
};