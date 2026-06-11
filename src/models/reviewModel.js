const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    id_khach_hang: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    id_xe: { type: mongoose.Schema.Types.ObjectId, ref: 'Bike', required: true },
    so_sao_danh_gia: { type: Number, required: true, min: 1, max: 5 },
    noi_dung_binh_luan: { type: String }
}, {
    timestamps: { createdAt: 'ngay_danh_gia' }
});

module.exports = mongoose.model('Review', reviewSchema, 'danhgias');