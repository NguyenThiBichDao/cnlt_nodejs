// src/utils/dateHelper.js

/**
 * 📅 Chuyển đổi ngày tháng sang định dạng tiếng Việt
 * Ví dụ: 2026-06-04 -> "4/6/2026"
 */
const formatDate = (date) => { 
    return new Date(date).toLocaleDateString("vi-VN"); 
}; 

/**
 * 📅 Chuyển đổi ngày giờ sang định dạng tiếng Việt
 * Ví dụ: 2026-06-04T08:00:00 -> "08:00:00, 4/6/2026"
 */
const formatDateTime = (date) => { 
    return new Date(date).toLocaleString("vi-VN"); 
}; 

/**
 * 🛵 Tính tổng số ngày thuê xe máy thực tế
 * @param {string|Date} startDate - Ngày nhận xe máy
 * @param {string|Date} endDate - Ngày khách trả xe máy
 * @returns {number} Số ngày thuê thực tế (Tối thiểu tính 1 ngày)
 */
const calculateRentalDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const timeDiff = end.getTime() - start.getTime();
    let days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (days <= 0) days = 1;
    
    return days;
};

module.exports = { 
    formatDate, 
    formatDateTime,
    calculateRentalDays
};