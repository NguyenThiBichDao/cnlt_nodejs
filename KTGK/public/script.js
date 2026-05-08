const socket = io();

let currentReceiver = "";
let myUsername = "";
let allMessages = [];
let unreadUsers = [];
let onlineUsers = [];
let typingTimeout;

// ==========================
// Xin quyền Notification
// ==========================
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

// ==========================
// Đăng nhập
// ==========================
function login() {
    const nameInput = document.getElementById("username");
    const name = nameInput.value.trim();

    if (!name) return;

    myUsername = name;

    socket.emit("register-user", name);

    const welcomeBox = document.getElementById("welcome-msg");

    if (welcomeBox) {
        welcomeBox.innerHTML = `✨ Chào <b>${escapeHTML(name)}</b>, chúc bạn trò chuyện vui vẻ! ✨`;
    }

    document.getElementById("login-screen").style.display = "none";
    document.getElementById("chat-screen").style.display = "block";
}

// ==========================
// Load lịch sử chat
// ==========================
socket.on("load-history", (history) => {
    allMessages = history || [];
});

// ==========================
// Update user list
// ==========================
socket.on("update-user-list", (userNames) => {
    onlineUsers = [...new Set(userNames)];
    filterUsers();
});

// ==========================
// Filter user
// ==========================
function filterUsers() {
    const searchText = document
        .getElementById("search-user")
        .value.toLowerCase();

    const list = document.getElementById("users");

    list.innerHTML = "";

    const otherUsers = onlineUsers.filter(
        (name) =>
            name !== myUsername &&
            name.toLowerCase().includes(searchText)
    );

    otherUsers.forEach((u) => {
        const li = document.createElement("li");

        const dot = unreadUsers.includes(u)
            ? '<span class="dot" style="color:red;margin-left:5px;">●</span>'
            : "";

        li.innerHTML = `<span>${escapeHTML(u)}</span>${dot}`;

        if (u === currentReceiver) {
            li.classList.add("active");
        }

        li.onclick = () => {
            unreadUsers = unreadUsers.filter((name) => name !== u);

            selectUser(u);

            filterUsers();
        };

        list.appendChild(li);
    });
}

// ==========================
// Chọn người chat
// ==========================
function selectUser(name) {
    currentReceiver = name;

    document.getElementById(
        "chat-with"
    ).innerText = `Đang chat với: ${name}`;

    renderMessages();

    // Đánh dấu đã xem
    const unseenMessages = allMessages.filter(
        (m) =>
            m.sender === name &&
            m.to === myUsername &&
            m.status !== "✓ Đã xem"
    );

    unseenMessages.forEach((msg) => {
        if (msg._id) {
            socket.emit("msg-received", {
                msgId: msg._id,
                senderName: name,
                status: "✓ Đã xem",
            });

            msg.status = "✓ Đã xem";
        }
    });

    unreadUsers = unreadUsers.filter((u) => u !== name);

    filterUsers();
}

// ==========================
// Render messages
// ==========================
function renderMessages() {
    const chatContainer = document.getElementById("messages");

    chatContainer.innerHTML = "";

    const privateHistory = allMessages.filter(
        (m) =>
            (m.sender === myUsername &&
                m.to === currentReceiver) ||
            (m.sender === currentReceiver &&
                m.to === myUsername)
    );

    privateHistory.forEach((m) => {
        const type =
            m.sender === myUsername ? "sent" : "received";

        displayMessage(
            m.message,
            type,
            m.time,
            m.status
        );
    });

    chatContainer.scrollTop =
        chatContainer.scrollHeight;
}

// ==========================
// Gửi tin nhắn
// ==========================
function sendMessage() {
    const msgInput = document.getElementById("msg-input");

    const msg = msgInput.value.trim();

    if (!currentReceiver || !msg) return;

    const msgData = {
        to: currentReceiver,
        sender: myUsername,
        message: escapeHTML(msg),
        time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        }),
        status: "✓ Đã gửi",
    };

    socket.emit("private-message", msgData);

    allMessages.push(msgData);

    renderMessages();

    msgInput.value = "";
}

// ==========================
// Nhận tin nhắn
// ==========================
socket.on("receive-message", (data) => {
    allMessages.push(data);

    // Nếu đang mở đúng khung chat
    if (data.sender === currentReceiver) {
        renderMessages();

        if (data._id) {
            socket.emit("msg-received", {
                msgId: data._id,
                senderName: data.sender,
                status: "✓ Đã xem",
            });
        }
    } else {
        // Chưa đọc
        if (!unreadUsers.includes(data.sender)) {
            unreadUsers.push(data.sender);
        }

        filterUsers();

        showNotification(data.sender, data.message);
    }
});

// ==========================
// Update trạng thái
// ==========================
socket.on("update-status", ({ msgId, status }) => {
    const msg = allMessages.find(
        (m) => m._id === msgId
    );

    if (msg) {
        msg.status = status;
    }

    renderMessages();
});

// ==========================
// Gửi ảnh
// ==========================
function sendFile() {
    const fileInput =
        document.getElementById("file-input");

    const file = fileInput.files[0];

    if (!file || !currentReceiver) return;

    const reader = new FileReader();

    reader.onloadend = () => {
        const imgTag = `
            <img 
                src="${reader.result}" 
                style="
                    max-width:200px;
                    border-radius:10px;
                    cursor:pointer;
                "
                onclick="window.open(this.src)"
            >
        `;

        const msgData = {
            to: currentReceiver,
            sender: myUsername,
            message: imgTag,
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
            status: "✓ Đã gửi",
        };

        socket.emit("private-message", msgData);

        allMessages.push(msgData);

        renderMessages();

        fileInput.value = "";
    };

    reader.readAsDataURL(file);
}

// ==========================
// Sticker
// ==========================
function toggleStickers() {
    const panel =
        document.getElementById("sticker-panel");

    panel.style.display =
        panel.style.display === "flex"
            ? "none"
            : "flex";
}

function sendSticker(emoji) {
    if (!currentReceiver) {
        return alert("Chọn người nhận đã nhé!");
    }

    const stickerTag = `
        <span style="
            font-size:50px;
            display:block;
            line-height:1;
        ">
            ${emoji}
        </span>
    `;

    const msgData = {
        to: currentReceiver,
        sender: myUsername,
        message: stickerTag,
        time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        }),
        status: "✓ Đã gửi",
    };

    socket.emit("private-message", msgData);

    allMessages.push(msgData);

    renderMessages();

    toggleStickers();
}

// ==========================
// Hiển thị tin nhắn
// ==========================
function displayMessage(
    text,
    type,
    time,
    status = ""
) {
    const chatContainer =
        document.getElementById("messages");

    const div = document.createElement("div");

    div.className = `message-wrapper ${type}`;

    const statusText =
        type === "sent" && status
            ? ` - ${status}`
            : "";

    div.innerHTML = `
        <div class="bubble">${text}</div>
        <div class="time">
            ${time}${statusText}
        </div>
    `;

    chatContainer.appendChild(div);
}

// ==========================
// Typing
// ==========================
document
    .getElementById("msg-input")
    .addEventListener("input", () => {
        if (!currentReceiver) return;

        socket.emit("typing", {
            to: currentReceiver,
            isTyping: true,
        });

        clearTimeout(typingTimeout);

        typingTimeout = setTimeout(() => {
            socket.emit("typing", {
                to: currentReceiver,
                isTyping: false,
            });
        }, 2000);
    });

socket.on("display-typing", (data) => {
    const status =
        document.getElementById("typing-status");

    if (
        data.isTyping &&
        data.sender === currentReceiver
    ) {
        status.innerText = `${data.sender} đang gõ...`;
    } else {
        status.innerText = "";
    }
});

// ==========================
// Notification
// ==========================
function showNotification(sender, message) {
    if (Notification.permission === "granted") {
        new Notification(sender, {
            body: stripHTML(message),
            icon: "https://cdn-icons-png.flaticon.com/512/733/733585.png",
        });
    }
}

// ==========================
// Đóng sticker khi click ngoài
// ==========================
document.addEventListener("click", (event) => {
    const panel =
        document.getElementById("sticker-panel");

    const btnSticker =
        document.querySelector(".btn-icon");

    if (
        panel.style.display === "flex" &&
        !panel.contains(event.target) &&
        event.target !== btnSticker
    ) {
        panel.style.display = "none";
    }
});

// ==========================
// Enter để gửi
// ==========================
document
    .getElementById("msg-input")
    .addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    });

// ==========================
// Escape HTML chống XSS
// ==========================
function escapeHTML(str) {
    return str.replace(/[&<>"']/g, (match) => {
        const escape = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;",
        };

        return escape[match];
    });
}

// ==========================
// Xóa HTML khỏi notification
// ==========================
function stripHTML(html) {
    const div = document.createElement("div");

    div.innerHTML = html;

    return div.textContent || div.innerText || "";
}