const mongoose = require('mongoose');

const bikeSchema = new mongoose.Schema({
    ten_xe: { type: String, required: true },
    id_danh_muc: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    bien_so_xe: { type: String, required: true, unique: true },
    gia_thue_theo_ngay: { type: Number, required: true },
    duong_dan_anh: { type: String },
    trang_thai_xe: { type: String, enum: ['available', 'rented', 'maintenance'], default: 'available' },
    mo_ta_chi_tiet: { type: String }
}, {
    timestamps: { createdAt: 'ngay_tao', updatedAt: 'ngay_cap_nhat' }
});

module.exports = mongoose.model('Bike', bikeSchema, 'bikes');