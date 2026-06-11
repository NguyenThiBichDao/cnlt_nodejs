exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng chọn file ảnh để tải lên!'
            });
        }

        res.json({
            success: true,
            file: req.file.filename,
            message: 'Tải ảnh lên thành công!'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Lỗi khi tải ảnh lên!'
        });
    }
};