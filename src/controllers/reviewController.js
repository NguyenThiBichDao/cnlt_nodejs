const reviewService = require('../services/reviewService');
const responseHelper = require('../utils/responseHelper');

exports.createReview = async (req, res) => {
    try {
        const customerId = req.user?.id;
        const { id_xe, so_sao_danh_gia, noi_dung_binh_luan } = req.body;

        if (!id_xe || !so_sao_danh_gia) {
            return res.status(400).json(responseHelper.error('Vui lòng chọn xe và xếp hạng!'));
        }

        const reviewData = {
            id_khach_hang: customerId,
            id_xe,
            so_sao_danh_gia,
            noi_dung_binh_luan
        };

        const danhGiaMoi = await reviewService.createReview(reviewData);
        res.status(201).json(responseHelper.success(danhGiaMoi, 'Cảm ơn bạn đã gửi đánh giá!'));
    } catch (error) {
        if (error.code === 'NO_RENTAL') {
            return res.status(403).json(responseHelper.error(error.message));
        }
        if (error.code === 'ALREADY_REVIEWED') {
            return res.status(400).json(responseHelper.error(error.message));
        }
        res.status(500).json(responseHelper.error(error.message || 'Lỗi hệ thống!'));
    }
};

exports.getBikeReviews = async (req, res) => {
    try {
        const { bikeId } = req.params;
        const danhSachReview = await reviewService.getBikeReviews(bikeId);
        res.status(200).json(responseHelper.success(danhSachReview));
    } catch (error) {
        res.status(500).json(responseHelper.error(error.message));
    }
};

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await reviewService.getReviews();
        res.status(200).json(responseHelper.success(reviews));
    } catch (error) {
        res.status(500).json(responseHelper.error(error.message));
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await reviewService.deleteReview(id);
        if (!deleted) {
            return res.status(404).json(responseHelper.error('Không tìm thấy đánh giá!'));
        }
        res.status(200).json(responseHelper.success(deleted, 'Đã xóa đánh giá!'));
    } catch (error) {
        res.status(500).json(responseHelper.error(error.message));
    }
};