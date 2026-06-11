const API_BASE_URL = "http://localhost:5000/api";

// Hàm bổ trợ gọi API dùng chung cho toàn bộ dự án
async function apiFetch(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Tự động cấu hình Token xác thực nếu người dùng đã đăng nhập
    const token = localStorage.getItem("token");
    const headers = { ...options.headers };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    if (options.body && typeof options.body === 'object') {
        options.body = JSON.stringify(options.body);
        headers['Content-Type'] = 'application/json';
    }

    try {
        const response = await fetch(url, { ...options, headers });
        return await response.json();
    } catch (error) {
        console.error(`❌ Lỗi kết nối API (${endpoint}):`, error);
        return { success: false, message: "Không thể kết nối đến máy chủ server!" };
    }
}

// Đăng xuất xóa phiên làm việc
function logout() {
    localStorage.clear();
    alert("Đã đăng xuất tài khoản!");
    window.location.href = "/frontend/auth/login.html";
}