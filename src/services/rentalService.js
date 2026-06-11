const Rental = require("../models/rentalModel");
const Bike = require("../models/bikeModel");
const { calculateRentalDays } = require("../utils/dateHelper");

const getAllRentals = async (userId, role) => {
    if (role === 'admin') {
        return await Rental.find().populate('id_xe id_khach_hang');
    }
    return await Rental.find({ id_khach_hang: userId }).populate('id_xe');
};

const getRentalById = async (id) => {
    return await Rental.findById(id).populate('id_xe id_khach_hang');
};

const createRental = async (data) => {
    const { id_khach_hang, id_xe, ngay_bat_dau, ngay_du_kien_tra, tong_tien_thue } = data;
    
    const bike = await Bike.findById(id_xe);
    if (!bike) {
        throw new Error('Xe không tồn tại!');
    }
    
    if (bike.trang_thai_xe !== 'available') {
        throw new Error('Xe hiện không sẵn sàng cho thuê!');
    }
    
    const rentalDays = calculateRentalDays(ngay_bat_dau, ngay_du_kien_tra);
    const calculatedTotal = bike.gia_thue_theo_ngay * rentalDays;
    
    const rentalData = {
        id_khach_hang,
        id_xe,
        ngay_bat_dau,
        ngay_du_kien_tra,
        tong_tien_thue: data.tong_tien_thue || calculatedTotal
    };
    
    const rental = await Rental.create(rentalData);
    
    await Bike.findByIdAndUpdate(id_xe, { trang_thai_xe: 'rented' });
    
    return rental;
};

const updateRentalStatus = async (id, status) => {
    const rental = await Rental.findByIdAndUpdate(
        id,
        { trang_thai_don: status },
        { new: true, runValidators: true }
    ).populate('id_khach_hang id_xe');
    
    if (rental && ['cancelled', 'completed'].includes(status)) {
        await Bike.findByIdAndUpdate(rental.id_xe._id, { trang_thai_xe: 'available' });
    }
    
    return rental;
};

const markRentalAsPaid = async (id) => {
    return await Rental.findByIdAndUpdate(
        id,
        { trang_thai_thanh_toan: 'paid' },
        { new: true, runValidators: true }
    );
};

const deleteRental = async (id) => {
    return await Rental.findByIdAndDelete(id);
};

module.exports = {
    getAllRentals,
    getRentalById,
    createRental,
    updateRentalStatus,
    markRentalAsPaid,
    deleteRental
};