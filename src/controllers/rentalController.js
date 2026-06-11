const rentalService = require('../services/rentalService');
const emailService = require('../services/emailService');
const responseHelper = require('../utils/responseHelper');

exports.getAllRentals = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const role = req.user?.role;
        const rentals = await rentalService.getAllRentals(userId, role);
        return res.status(200).json(responseHelper.success(rentals));
    } catch (error) {
        return next(error);
    }
};

exports.createRental = async (req, res, next) => {
    try {
        const customerId = req.user?.id;
        const { id_xe, ngay_bat_dau, ngay_du_kien_tra, tong_tien_thue } = req.body;

        if (!id_xe || !ngay_bat_dau || !ngay_du_kien_tra) {
            return res.status(400).json(responseHelper.error('Thiếu thông tin bắt buộc!'));
        }

        const rentalData = {
            id_khach_hang: customerId,
            id_xe,
            ngay_bat_dau,
            ngay_du_kien_tra,
            tong_tien_thue
        };

        const rental = await rentalService.createRental(rentalData);
        return res.status(201).json(responseHelper.success(rental, 'Gửi yêu cầu đặt thuê xe thành công! Vui lòng chờ duyệt.'));
    } catch (error) {
        return next(error);
    }
};

exports.cancelRental = async (req, res, next) => {
    try {
        const { id } = req.params;
        const customerId = req.user?.id;

        const rental = await rentalService.getRentalById(id);
        if (!rental) {
            return res.status(404).json(responseHelper.error('Không tìm thấy đơn thuê yêu cầu.'));
        }

        if (rental.trang_thai_don !== 'pending') {
            return res.status(400).json(responseHelper.error('Chỉ có thể hủy đơn đang ở trạng thái "Chờ duyệt".'));
        }

        if (rental.id_khach_hang.toString() !== customerId) {
            return res.status(403).json(responseHelper.error('Bạn không có quyền hủy đơn này.'));
        }

        const updatedRental = await rentalService.updateRentalStatus(id, 'cancelled');
        return res.status(200).json(responseHelper.success(updatedRental, 'Đã hủy đơn thuê xe thành công!'));
    } catch (error) {
        return next(error);
    }
};

exports.approveRental = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { action } = req.body;

        if (!['approved', 'rejected', 'cancelled'].includes(action)) {
            return res.status(400).json(responseHelper.error('Hành động duyệt đơn không hợp lệ.'));
        }

        const rental = await rentalService.updateRentalStatus(id, action);
        if (!rental) {
            return res.status(404).json(responseHelper.error('Không tìm thấy đơn thuê yêu cầu.'));
        }

        if (action === 'approved' && rental.id_khach_hang?.email) {
            try {
                await emailService.sendRentalStatusUpdateMail(
                    rental.id_khach_hang.email,
                    rental.id_khach_hang.ho_ten,
                    action
                );
            } catch (emailError) {
                console.error('Email error:', emailError.message);
            }
        }

        const message = rental.trang_thai_don === 'approved'
            ? 'Duyệt đơn thuê xe thành công! Email thông báo đã được gửi tới khách hàng.'
            : 'Tình trạng đơn thuê đã được cập nhật.';

        return res.status(200).json(responseHelper.success(rental, message));
    } catch (error) {
        return next(error);
    }
};