const bikeService = require('../services/bikeService');

const getAllBikes = async (req, res) => {
    try {
        const filters = req.query || {};
        const danhSachXe = await bikeService.getAllBikes(filters);
        res.status(200).json({ success: true, data: danhSachXe });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getBikeById = async (req, res) => {
    try {
        const { id } = req.params;
        const chiTietXe = await bikeService.getBikeById(id);

        if (!chiTietXe) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin chiếc xe máy này!' });
        }

        res.status(200).json({ success: true, data: chiTietXe });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createBike = async (req, res) => {
    try {
        const { ten_xe, loai_xe, bien_so_xe, gia_thue_theo_ngay, duong_dan_anh, mo_ta_chi_tiet, id_danh_muc } = req.body;
        const xeTonTai = await bikeService.getBikeByLicensePlate(bien_so_xe);

        if (xeTonTai) {
            return res.status(400).json({ success: false, message: 'Biển số xe này đã tồn tại trên hệ thống!' });
        }

        const xeMoi = await bikeService.createBike({
            ten_xe,
            loai_xe,
            bien_so_xe,
            gia_thue_theo_ngay,
            duong_dan_anh,
            mo_ta_chi_tiet,
            id_danh_muc
        });

        res.status(201).json({ success: true, message: 'Thêm xe vào kho thành công!', data: xeMoi });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateBike = async (req, res) => {
    try {
        const { id } = req.params;
        const xeCapNhat = await bikeService.updateBike(id, req.body);

        if (!xeCapNhat) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy xe yêu cầu!' });
        }

        res.status(200).json({ success: true, message: 'Cập nhật dữ liệu xe thành công!', data: xeCapNhat });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteBike = async (req, res) => {
    try {
        const { id } = req.params;
        const xeXoa = await bikeService.deleteBike(id);

        if (!xeXoa) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy xe cần xóa!' });
        }

        res.status(200).json({ success: true, message: 'Đã xóa xe khỏi hệ thống thành công!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllBikes,
    getBikeById,
    createBike,
    updateBike,
    deleteBike
};
