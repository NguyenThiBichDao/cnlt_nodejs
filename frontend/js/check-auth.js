document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const currentPath = window.location.pathname;

    // Tự động tìm gốc thư mục dự án (Ví dụ: /ebikes-rental-system/frontend/)
    const basePath = currentPath.substring(0, currentPath.indexOf("/frontend/") + 10);
    const loginPageUrl = window.location.origin + basePath + "auth/login.html";
    const customerPageUrl = window.location.origin + basePath + "customer/home.html";
    const adminPageUrl = window.location.origin + basePath + "admin/dashboard.html";

    // 1. NẾU CHƯA ĐĂNG NHẬP
    if (!token || !role) {
        // Chỉ chuyển hướng nếu như KHÔNG phải đang đứng ở trang login (tránh lặp vô hạn)
        if (!currentPath.includes("login.html")) {
            alert("⚠️ Bạn cần đăng nhập để truy cập hệ thống!");
            window.location.href = loginPageUrl;
        }
        return;
    }

    // 2. NẾU LÀ KHÁCH HÀNG (customer) NHƯNG CỐ VÀO TRANG ADMIN
    if (currentPath.includes("/admin/") && role !== "admin") {
        alert("⛔ Bạn không có quyền truy cập khu vực Quản trị!");
        window.location.href = customerPageUrl;
        return;
    }

    // 3. NẾU LÀ ADMIN NHƯNG ĐI NHẦM VÀO CÁC TRANG CỦA KHÁCH
    if (role === "admin" && currentPath.includes("/customer/")) {
        if (currentPath.includes("booking.html") || currentPath.includes("profile.html") || currentPath.includes("reviews.html")) {
            window.location.href = adminPageUrl;
            return;
        }
    }
});

function logout() {
    if (confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
        const currentPath = window.location.pathname;
        const basePath = currentPath.substring(0, currentPath.indexOf("/frontend/") + 10);
        
        localStorage.clear(); 
        window.location.href = window.location.origin + basePath + "auth/login.html";
    }
}