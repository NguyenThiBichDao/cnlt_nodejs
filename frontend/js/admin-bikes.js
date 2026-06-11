let currentEditId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadBikes();
    setupModalEvents();
});

async function loadBikes() {
    const tableBody = document.getElementById('adminBikeTableBody');
    const res = await apiFetch('/bikes');
    
    if (!res.success) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #dc2626;">${res.message || 'Không thể tải danh sách xe.'}</td></tr>`;
        return;
    }
    
    if (res.data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">Chưa có xe nào trong hệ thống. Hãy thêm xe mới!</td></tr>';
        return;
    }
    
    tableBody.innerHTML = '';
    res.data.forEach(bike => {
        const serverUrl = "http://localhost:5000";
        const imgUrl = bike.duong_dan_anh 
            ? (bike.duong_dan_anh.startsWith('http') ? bike.duong_dan_anh : `${serverUrl}${bike.duong_dan_anh}`)
            : 'https://via.placeholder.com/80x60?text=No+Image';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${imgUrl}" alt="${bike.ten_xe}" style="width: 80px; height: 60px; object-fit: cover; border-radius: 8px;"></td>
            <td><strong>${bike.ten_xe}</strong></td>
            <td>${bike.bien_so_xe}</td>
            <td>${bike.gia_thue_theo_ngay.toLocaleString('vi-VN')} đ</td>
            <td><span class="status-badge ${bike.trang_thai_xe}">${renderStatus(bike.trang_thai_xe)}</span></td>
            <td>
                <button onclick="editBike('${bike._id}')" class="btn-action primary" style="padding: 6px 12px; font-size: 12px; margin-right: 5px;">Sửa</button>
                <button onclick="deleteBike('${bike._id}')" style="background: #dc2626; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">Xóa</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function renderStatus(status) {
    const map = {
        available: 'Sẵn sàng',
        rented: 'Đang cho thuê',
        maintenance: 'Bảo trì'
    };
    return map[status] || status;
}

function setupModalEvents() {
    const form = document.getElementById('bikeForm');
    
    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            await saveBike();
        };
    }
    
    const imageInput = document.getElementById('bikeImage');
    if (imageInput) {
        imageInput.onchange = handleImagePreview;
    }
}

function handleImagePreview(e) {
    const file = e.target.files[0];
    const preview = document.getElementById('imagePreview');
    if (file && preview) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            preview.src = ev.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

async function handleImageUpload(file) {
    if (!file) return '';
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
        const response = await fetch('http://localhost:5000/api/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });
        
        const result = await response.json();
        if (result.success) {
            return `/uploads/${result.file}`;
        }
        throw new Error(result.message || 'Upload ảnh thất bại');
    } catch (error) {
        alert('❌ ' + error.message);
        return '';
    }
}

async function saveBike() {
    const formData = {
        ten_xe: document.getElementById('bikeName').value,
        loai_xe: document.getElementById('bikeType').value,
        bien_so_xe: document.getElementById('bikeLicense').value,
        gia_thue_theo_ngay: Number(document.getElementById('bikePrice').value),
        mo_ta_chi_tiet: document.getElementById('bikeDescription').value,
        trang_thai_xe: document.getElementById('bikeStatus').value
    };
    
    const imageInput = document.getElementById('bikeImage');
    let imageUrl = document.getElementById('currentImageUrl').value;
    
    if (imageInput && imageInput.files && imageInput.files[0]) {
        imageUrl = await handleImageUpload(imageInput.files[0]);
        if (!imageUrl) return;
    }
    formData.duong_dan_anh = imageUrl;
    
    let res;
    if (currentEditId) {
        res = await apiFetch(`/bikes/${currentEditId}`, {
            method: 'PUT',
            body: formData
        });
    } else {
        res = await apiFetch('/bikes', {
            method: 'POST',
            body: formData
        });
    }
    
    if (res.success) {
        alert(currentEditId ? '✅ Cập nhật xe thành công!' : '✅ Thêm xe mới thành công!');
        document.getElementById('bikeModal').classList.remove('show');
        resetForm();
        loadBikes();
    } else {
        alert('❌ ' + (res.message || 'Lỗi khi lưu xe'));
    }
}

window.editBike = async (id) => {
    const res = await apiFetch(`/bikes/${id}`);
    if (!res.success || !res.data) {
        alert('Không thể tải thông tin xe!');
        return;
    }
    
    const bike = res.data;
    currentEditId = id;
    
    document.getElementById('bikeName').value = bike.ten_xe || '';
    document.getElementById('bikeType').value = bike.loai_xe || '';
    document.getElementById('bikeLicense').value = bike.bien_so_xe || '';
    document.getElementById('bikePrice').value = bike.gia_thue_theo_ngay || '';
    document.getElementById('bikeDescription').value = bike.mo_ta_chi_tiet || '';
    document.getElementById('bikeStatus').value = bike.trang_thai_xe || 'available';
    document.getElementById('currentImageUrl').value = bike.duong_dan_anh || '';
    
    const preview = document.getElementById('imagePreview');
    if (preview && bike.duong_dan_anh) {
        const serverUrl = "http://localhost:5000";
        preview.src = bike.duong_dan_anh.startsWith('http') ? bike.duong_dan_anh : `${serverUrl}${bike.duong_dan_anh}`;
        preview.style.display = 'block';
    }
    
    document.getElementById('bikeModal').classList.add('show');
};

window.deleteBike = async (id) => {
    if (!confirm('⚠️ Bạn có chắc chắn muốn xóa xe này khỏi hệ thống?')) return;
    
    const res = await apiFetch(`/bikes/${id}`, {
        method: 'DELETE'
    });
    
    if (res.success) {
        alert('✅ Đã xóa xe thành công!');
        loadBikes();
    } else {
        alert('❌ ' + (res.message || 'Lỗi khi xóa xe'));
    }
};

window.toggleBikeModal = (isEdit = false) => {
    if (!isEdit) {
        resetForm();
        currentEditId = null;
    }
    document.getElementById('bikeModal').classList.add('show');
};

function resetForm() {
    const form = document.getElementById('bikeForm');
    if (form) {
        form.reset();
    }
    const preview = document.getElementById('imagePreview');
    if (preview) {
        preview.style.display = 'none';
        preview.src = '';
    }
    document.getElementById('currentImageUrl').value = '';
}