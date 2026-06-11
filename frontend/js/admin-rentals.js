/ frontend/js/admin-rentals.js
// Hiển thị danh sách đơn thuê và xử lý DUYỆT / TỪ CHỐI cho admin.
 
const STATUS_META = {
    pending:   { label: "⏳ Chờ duyệt",  color: "#d97706", bg: "#fef3c7" },
    approved:  { label: "✅ Đã duyệt",   color: "#059669", bg: "#d1fae5" },
    rejected:  { label: "❌ Đã từ chối", color: "#dc2626", bg: "#fee2e2" },
    ongoing:   { label: "🛵 Đang thuê", color: "#2563eb", bg: "#dbeafe" },
    completed: { label: "🏁 Hoàn tất",   color: "#4b5563", bg: "#e5e7eb" },
    cancelled: { label: "🚫 Đã hủy",     color: "#6b7280", bg: "#f3f4f6" }
};
 
function formatDate(d) {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("vi-VN");
}
 
function statusBadge(status) {
    const meta = STATUS_META[status] || { label: status, color: "#374151", bg: "#e5e7eb" };
    return `<span style="display:inline-block;padding:4px 10px;border-radius:999px;font-size:12px;font-weight:600;color:${meta.color};background:${meta.bg};">${meta.label}</span>`;
}
 
async function loadRentals() {
    const tbody = document.getElementById("adminRentalTableBody");
    if (!tbody) return;
 
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:20px;">Đang tải dữ liệu...</td></tr>`;
 
    const res = await apiFetch("/rentals");
    if (!res.success || !Array.isArray(res.data)) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#dc2626;padding:20px;">Không tải được danh sách đơn thuê!</td></tr>`;
        return;
    }
 
    if (res.data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:20px;">Hiện chưa có đơn đặt xe nào.</td></tr>`;
        return;
    }
 
    tbody.innerHTML = res.data.map((don) => {
        const khach = don.id_khach_hang || {};
        const xe = don.id_xe || {};
        const isPending = don.trang_thai_don === "pending";
 
        const actions = isPending
            ? `<button class="btn-approve" onclick="approveOrder('${don._id}')">Duyệt</button>
               <button class="btn-reject" onclick="rejectOrder('${don._id}')">Từ chối</button>`
            : `<span style="color:#9ca3af;font-size:13px;">Đã xử lý</span>`;
 
        return `<tr>
            <td>
                <strong>${khach.ho_ten || "(không rõ)"}</strong><br>
                <small style="color:#6b7280;">${khach.email || ""}</small>
            </td>
            <td>${xe.ten_xe || "(không rõ)"}<br><small style="color:#6b7280;">${xe.bien_so_xe || ""}</small></td>
            <td>${formatDate(don.ngay_bat_dau)}</td>
            <td>${formatDate(don.ngay_du_kien_tra)}</td>
            <td>${statusBadge(don.trang_thai_don)}${don.ly_do_tu_choi ? `<br><small style="color:#dc2626;">${don.ly_do_tu_choi}</small>` : ""}</td>
            <td>${actions}</td>
        </tr>`;
    }).join("");
}
 
async function approveOrder(rentalId) {
    if (!confirm("Bạn có chắc chắn muốn DUYỆT đơn thuê và bàn giao xe cho khách?")) return;
 
    const res = await apiFetch(`/rentals/${rentalId}/approve`, { method: "PUT" });
    if (res.success) {
        alert("Duyệt đơn thành công! Đã gửi email thông báo cho khách.");
        loadRentals();
    } else {
        alert(res.message || "Có lỗi xảy ra khi duyệt đơn!");
    }
}
 
async function rejectOrder(rentalId) {
    const lyDo = prompt("Nhập lý do từ chối đơn (sẽ gửi email cho khách):", "");
    if (lyDo === null) return; // người dùng bấm Hủy
 
    const res = await apiFetch(`/rentals/${rentalId}/reject`, {
        method: "PUT",
        body: { ly_do_tu_choi: lyDo }
    });
    if (res.success) {
        alert("Đã từ chối đơn và gửi email thông báo cho khách.");
        loadRentals();
    } else {
        alert(res.message || "Có lỗi xảy ra khi từ chối đơn!");
    }
}
 
// Style cho nút hành động
(function injectRentalStyle() {
    const style = document.createElement("style");
    style.textContent = `
        .btn-approve, .btn-reject { border:none; padding:6px 14px; border-radius:6px; cursor:pointer; font-size:13px; font-weight:600; margin-right:6px; }
        .btn-approve { background:#10b981; color:#fff; }
        .btn-approve:hover { background:#059669; }
        .btn-reject { background:#ef4444; color:#fff; }
        .btn-reject:hover { background:#dc2626; }
    `;
    document.head.appendChild(style);
})();
 
document.addEventListener("DOMContentLoaded", loadRentals);