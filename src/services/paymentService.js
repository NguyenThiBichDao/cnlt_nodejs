const Payment = require("../models/paymentModel");

const getPayments = async (userId, role) => {
    const paymentQuery = Payment.find().populate({
        path: 'id_don_thue',
        populate: { path: 'id_khach_hang', select: 'ho_ten email' }
    });

    if (role === 'admin') {
        return await paymentQuery;
    }

    const payments = await paymentQuery;
    return payments.filter(
        (payment) => payment.id_don_thue && String(payment.id_don_thue.id_khach_hang._id) === String(userId)
    );
};

const getPaymentByRentalId = async (rentalId) => {
    return await Payment.findOne({ id_don_thue: rentalId });
};

const createPayment = async (data) => {
    return await Payment.create(data);
};

const updatePaymentStatus = async (paymentId, status) => {
    return await Payment.findByIdAndUpdate(
        paymentId,
        { trang_thai_giao_dich: status },
        { new: true, runValidators: true }
    );
};

const deletePayment = async (id) => {
    return await Payment.findByIdAndDelete(id);
};

module.exports = {
    getPayments,
    getPaymentByRentalId,
    createPayment,
    updatePaymentStatus,
    deletePayment
};