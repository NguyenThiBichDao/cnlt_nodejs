const success = (data = null, message = "Thành công") => {
    return {
        success: true,
        message,
        data
    };
};

const error = (message = "Có lỗi xảy ra") => {
    return {
        success: false,
        message
    };
};

module.exports = {
    success,
    error
};