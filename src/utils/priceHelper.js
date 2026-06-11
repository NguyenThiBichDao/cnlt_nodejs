const formatPrice = (price) => {

    return Number(price)
        .toLocaleString("vi-VN") + " VNĐ";

};

module.exports = {
    formatPrice
};