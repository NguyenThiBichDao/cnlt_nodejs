const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    id_khach_hang: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    id_xe: { type: mongoose.Schema.Types.ObjectId, ref: 'Bike', required: true },
    ngay_bat_dau: { type: Date, required: true },
    ngay_du_kien_tra: { type: Date, required: true },
    ngay_tra_thuc_te: { type: Date, default: null },
    tong_tien_thue: { type: Number, required: true },
    trang_thai_don: { type: String, enum: ['pending', 'approved', 'ongoing', 'completed', 'cancelled'], default: 'pending' },
    trang_thai_thanh_toan: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
    so_cccd: { type: String },
    dia_diem_nhan: { type: String },
    ghi_chu: { type: String }
}, {
    timestamps: { createdAt: 'ngay_tao', updatedAt: 'ngay_cap_nhat' }
});

module.exports = mongoose.model('Rental', rentalSchema, 'rentals');