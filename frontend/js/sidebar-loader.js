document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebarMenu');
    if (!sidebar) return;

    sidebar.innerHTML = `
        <nav class="admin-nav">
            <ul>
                <li><a href="dashboard.html">Dashboard</a></li>
                <li><a href="bikes.html" class="active">Quản lý xe</a></li>
                <li><a href="rentals.html">Duyệt đơn thuê</a></li>
                <li><a href="chat.html">Chat khách hàng</a></li>
                <li><a href="#" onclick="logout()">Đăng xuất</a></li>
            </ul>
        </nav>
    `;
});