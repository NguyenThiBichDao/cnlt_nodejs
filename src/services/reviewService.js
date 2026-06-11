const Review = require("../models/reviewModel");
const Rental = require("../models/rentalModel");

const getReviews = async () => {
    return await Review.find()
        .populate("id_khach_hang", "ho_ten email")
        .populate("id_xe", "ten_xe bien_so_xe")
        .sort({ createdAt: -1 });
};

const getBikeReviews = async (bikeId) => {
    return await Review.find({ id_xe: bikeId })
        .populate("id_khach_hang", "ho_ten email")
        .sort({ createdAt: -1 });
};

const createReview = async (data) => {
    const { id_khach_hang, id_xe, so_sao_danh_gia, noi_dung_binh_luan } = data;
    
    const hasCompletedRental = await Rental.findOne({
        id_khach_hang,
        id_xe,
        trang_thai_don: { $in: ['completed', 'approved'] }
    });
    
    if (!hasCompletedRental) {
        const error = new Error('Bạn chỉ có thể đánh giá xe sau khi đã thuê và hoàn thành!');
        error.code = 'NO_RENTAL';
        throw error;
    }

    const hasReviewed = await Review.findOne({
        id_khach_hang,
        id_xe
    });

    if (hasReviewed) {
        const error = new Error('Bạn đã đánh giá xe này rồi!');
        error.code = 'ALREADY_REVIEWED';
        throw error;
    }

    return await Review.create({
        id_khach_hang,
        id_xe,
        so_sao_danh_gia,
        noi_dung_binh_luan
    });
};

const deleteReview = async (id) => {
    return await Review.findByIdAndDelete(id);
};

module.exports = {
    getReviews,
    getBikeReviews,
    createReview,
    deleteReview
};