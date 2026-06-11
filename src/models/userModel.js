const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    ho_ten: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mat_khau: { type: String, required: true },
    vai_tro: { type: String, enum: ['admin', 'customer'], default: 'customer' },
    so_dien_thoai: { type: String },
    anh_dai_dien: { type: String }
}, {
    timestamps: { createdAt: 'ngay_tao', updatedAt: 'ngay_cap_nhat' }
});

module.exports = mongoose.model('User', userSchema, 'users');