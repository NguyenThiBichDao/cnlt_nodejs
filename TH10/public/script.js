const socket = io();
let currentReceiver = "";

// 1. Đăng nhập
function login() {
    const name = document.getElementById('username').value;
    if (name) {
        socket.emit('register-user', name);
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('chat-screen').style.display = 'block';
    }
}

// 2. Cập nhật danh sách người dùng
socket.on('update-user-list', (userNames) => {
    const list = document.getElementById('users');
    list.innerHTML = userNames.map(u => `<li onclick="selectUser('${u}')">${u}</li>`).join('');
});

// 3. Chọn người để chat
function selectUser(name) {
    currentReceiver = name;
    document.getElementById('chat-with').innerText = "Đang chat với: " + name;
}

// 4. Hàm Gửi tin nhắn (CHỈ GIỮ LẠI 1 BẢN NÀY)
function sendMessage() {
    const msgInput = document.getElementById('msg-input');
    const msg = msgInput.value;
    if (currentReceiver && msg) {
        socket.emit('private-message', { to: currentReceiver, message: msg });
        displayMessage(msg, 'sent'); // Hiển thị nội dung sạch
        msgInput.value = "";
    }
}

// 5. Lắng nghe tin nhắn đến (CHỈ GIỮ LẠI 1 BẢN NÀY)
socket.on('receive-message', (data) => {
    // Chỉ hiển thị nội dung tin nhắn, không kèm tên người gửi
    displayMessage(data.message, 'received');
});

// 6. Hàm hiển thị tin nhắn lên giao diện
function displayMessage(text, type) {
    const chatContainer = document.getElementById('messages');
    const div = document.createElement('div');
    div.className = `message-wrapper ${type}`;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    div.innerHTML = `
        <div class="bubble">${text}</div>
        <div class="time">${time}</div>
    `;

    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
