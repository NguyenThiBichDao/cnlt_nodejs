const User = require("../models/userModel");

const getUsers = async () => {
    return await User.find();
};

const getUserById = async (id) => {
    return await User.findById(id);
};

const createUser = async (data) => {
    return await User.create(data);
};

const updateUser = async (id, data) => {
    return await User.findByIdAndUpdate(
        id,
        data,
        { new: true, runValidators: true }
    );
};

const toggleUserStatus = async (id) => {
    const user = await User.findById(id);
    if (!user) return null;

    const newStatus = !user.trang_thai_hoat_dong;

    return await User.findByIdAndUpdate(
        id,
        { trang_thai_hoat_dong: newStatus },
        { new: true }
    );
};

const deleteUser = async (id) => {
    return await User.findByIdAndDelete(id);
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    toggleUserStatus,
    deleteUser
};
