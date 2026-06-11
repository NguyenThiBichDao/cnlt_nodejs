const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    id_don_thue: { type: mongoose.Schema.Types.ObjectId, ref: 'Rental', required: true },
    so_tien_thanh_toan: { type: Number, required: true },
    phuong_thuc_thanh_toan: { type: String, required: true },
    ma_giao_dich_ngan_hang: { type: String },
    trang_thai_giao_dich: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' }
}, {
    timestamps: { createdAt: 'ngay_thanh_toan' }
});

module.exports = mongoose.model('Payment', paymentSchema, 'thanhtoans');