async function approveOrder(rentalId) {
    if (!confirm("Bạn có chắc chắn muốn duyệt đơn thuê và bàn giao xe cho khách?")) return;
    
    const res = await apiFetch(`/rentals/${rentalId}/approve`, {
        method: "PUT"
    });

    if (res.success) {
        alert("Duyệt đơn cấp phát xe thành công!");
        location.reload();
    } else {
        alert(res.message);
    }
}