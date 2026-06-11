const Bike = require("../models/bikeModel");

const getAllBikes = async (filters = {}) => {
  let query = {};
  if (filters.loai_xe) {
    query.loai_xe = filters.loai_xe;
  }
  if (filters.trang_thai_xe) {
    query.trang_thai_xe = filters.trang_thai_xe;
  }
  if (filters.gia_min || filters.gia_max) {
    query.gia_thue_theo_ngay = {};
    if (filters.gia_min) query.gia_thue_theo_ngay.$gte = Number(filters.gia_min);
    if (filters.gia_max) query.gia_thue_theo_ngay.$lte = Number(filters.gia_max);
  }
  return await Bike.find(query);
};

const getBikeById = async (id) => {
  return await Bike.findById(id);
};

const getBikeByLicensePlate = async (bien_so_xe) => {
  return await Bike.findOne({ bien_so_xe });
};

const createBike = async (data) => {
  return await Bike.create(data);
};

const updateBike = async (id, data) => {
  return await Bike.findByIdAndUpdate(
    id, 
    data, 
    { new: true, runValidators: true }
  );
};

const deleteBike = async (id) => {
  return await Bike.findByIdAndDelete(id);
};

module.exports = {
  getAllBikes,
  getBikeById,
  getBikeByLicensePlate,
  createBike,
  updateBike,
  deleteBike
};
