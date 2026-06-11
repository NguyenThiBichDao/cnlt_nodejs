// frontend/js/customer.js (Phần xử lý hiển thị chi tiết xe máy)
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const bikeId = urlParams.get("id");
    if (bikeId && document.getElementById("bikeDetailContainer")) {
        loadBikeDetail(bikeId);
    }
});

async function loadBikeDetail(id) {
    const container = document.getElementById("bikeDetailContainer");
    const res = await apiFetch(`/bikes/${id}`);
    
    if (!res.success || !res.data) {
        container.innerHTML = "<p style='color: var(--danger); text-align: center;'>❌ Không thể tải thông tin chiếc xe máy này!</p>";
        return;
    }
    
    const bike = res.data;
    const serverUrl = "http://localhost:5000";
    const imgUrl = bike.duong_dan_anh 
        ? (bike.duong_dan_anh.startsWith('http') ? bike.duong_dan_anh : `${serverUrl}${bike.duong_dan_anh}`) 
        : '../assets/image/banner.jpg';
        
    // Cập nhật giao diện chi tiết xe máy du lịch chuẩn
    container.innerHTML = `
        <div class="detail-card">
            <div class="detail-image-box">
                <img src="${imgUrl}" alt="${bike.ten_xe}">
            </div>
            <div class="detail-info-box">
                <!-- Đổi thành phân loại xe máy thực tế: Xe ga, xe số, xe côn -->
                <span class="category-tag">${bike.loai_xe || 'Xe máy du lịch'}</span>
                <h2>${bike.ten_xe}</h2>
                <div class="specs-grid">
                    <div class="spec-item">🔢 Biển số: <strong>${bike.bien_so_xe}</strong></div>
                    <div class="spec-item">📌 Trạng thái: <strong style="color: var(--primary-yellow)">${bike.trang_thai_xe === 'available' ? 'Sẵn sàng' : 'Đã được thuê'}</strong></div>
                </div>
                <p class="description-text">${bike.mo_ta_chi_tiet || 'Xe đời mới vận hành êm ái, tiết kiệm xăng, được trang bị sẵn 2 mũ bảo hiểm đạt chuẩn.'}</p>
                <div class="price-highlight">
                    Giá thuê: <span>${bike.gia_thue_theo_ngay.toLocaleString('vi-VN')} đ</span> / ngày
                </div>
                <form id="rentalForm" class="booking-form">
                    <div class="date-group">
                        <div>
                            <label>Ngày nhận xe</label>
                            <input type="date" id="ngay_bat_dau" required>
                        </div>
                        <div>
                            <label>Ngày trả xe</label>
                            <input type="date" id="ngay_ket_thuc" required>
                        </div>
                    </div>
                    <button type="submit" class="btn-book">TIẾP TỤC ĐIỀN THÔNG TIN ĐẶT XE</button>
                </form>
            </div>
        </div>
    `;

    // Thiết lập ngày tối thiểu khách có thể chọn là ngày hôm nay
    const today = new Date().toISOString().split('T')[0];
    document.getElementById("ngay_bat_dau").min = today;
    document.getElementById("ngay_ket_thuc").min = today;

    // Xử lý sự kiện khi khách bấm nút Tiếp tục đặt xe
    document.getElementById("rentalForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const ngay_bat_dau = document.getElementById("ngay_bat_dau").value;
        const ngay_ket_thuc = document.getElementById("ngay_ket_thuc").value;

        // Kiểm tra logic ngày đặt
        if (new Date(ngay_ket_thuc) <= new Date(ngay_bat_dau)) {
            alert("❌ Ngày trả xe phải sau ngày nhận xe ít nhất 1 ngày!");
            return;
        }

        // Thay vì gọi API đặt ngay, chuyển hướng khách sang trang booking.html 
        // và mang theo tham số trên thanh địa chỉ URL để lưu thông tin thông suốt
        window.location.href = `booking.html?id=${id}&start=${ngay_bat_dau}&end=${ngay_ket_thuc}`;
    });
}