// frontend/js/dashboard.js
const API_URL = "http://localhost:5000/api";

document.addEventListener("DOMContentLoaded", () => {
    fetchDashboardStats();
});

async function fetchDashboardStats() {
    try {
        const token = localStorage.getItem("token");
        
        const response = await fetch(`${API_URL}/dashboard/stats`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (response.ok && result.success) {
            const stats = result.data;
            if (document.getElementById("statsTotalRevenue")) {
                document.getElementById("statsTotalRevenue").innerText = (stats.totalRevenue || 0).toLocaleString('vi-VN') + " đ";
            }
            if (document.getElementById("statsTotalRentals")) {
                document.getElementById("statsTotalRentals").innerText = (stats.totalRentals || 0) + " đơn";
            }
            if (document.getElementById("statsTotalUsers")) {
                document.getElementById("statsTotalUsers").innerText = (stats.totalUsers || 0) + " user";
            }
        } else {
            console.warn("Chưa tải được số liệu realtime từ Backend:", result.message);
            loadMockStats();
        }
    } catch (error) {
        console.error("Lỗi kết nối API Dashboard:", error);
        loadMockStats();
    }
}

function loadMockStats() {
    if (document.getElementById("statsTotalRevenue")) {
        document.getElementById("statsTotalRevenue").innerText = "15.500.000 đ";
    }
    if (document.getElementById("statsTotalRentals")) {
        document.getElementById("statsTotalRentals").innerText = "42 đơn";
    }
    if (document.getElementById("statsTotalUsers")) {
        document.getElementById("statsTotalUsers").innerText = "18 user";
    }
}