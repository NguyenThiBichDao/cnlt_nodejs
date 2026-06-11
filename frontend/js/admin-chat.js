// frontend/js/admin-chat.js
// Trang quản lý chat tập trung phía ADMIN.
const SERVER_URL = "http://localhost:5000";
 
let currentCustomerId = null;
let currentCustomerName = "";
const renderedIds = new Set();
 
function fmtTime(d) {
    return new Date(d).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}
 
async function loadConversations() {
    const listEl = document.getElementById("convList");
    const res = await apiFetch("/chat/conversations");
 
    if (!res.success || !Array.isArray(res.data)) {
        listEl.innerHTML = `<div style="padding:16px;color:#dc2626;">Không tải được danh sách hội thoại.</div>`;
        return;
    }
    if (res.data.length === 0) {
        listEl.innerHTML = `<div style="padding:16px;color:#9ca3af;">Chưa có cuộc trò chuyện nào.</div>`;
        return;
    }
 
    listEl.innerHTML = res.data.map((c) => {
        const active = String(c.id_khach_hang) === String(currentCustomerId) ? "active" : "";
        const badge = c.chua_doc > 0 ? `<span class="badge">${c.chua_doc}</span>` : "";
        return `<div class="conv-item ${active}" onclick="selectConversation('${c.id_khach_hang}', '${(c.ho_ten || "").replace(/'/g, "")}')">
                    <div class="name">${c.ho_ten || "(không rõ)"} ${badge}</div>
                    <div class="preview">${c.nguoi_gui_cuoi === "admin" ? "Bạn: " : ""}${c.tin_cuoi || ""}</div>
                </div>`;
    }).join("");
}
 
function appendBubble(msg) {
    if (msg._id && renderedIds.has(msg._id)) return;
    if (msg._id) renderedIds.add(msg._id);
 
    const thread = document.getElementById("chatThread");
    const div = document.createElement("div");
    div.className = `bubble ${msg.nguoi_gui}`;
    div.innerHTML = `${msg.noi_dung}<span class="time">${fmtTime(msg.ngay_gui || Date.now())}</span>`;
    thread.appendChild(div);
    thread.scrollTop = thread.scrollHeight;
}
 
async function selectConversation(customerId, name) {
    currentCustomerId = customerId;
    currentCustomerName = name;
    renderedIds.clear();
 
    document.getElementById("chatPaneHeader").textContent = `Đang trò chuyện với: ${name}`;
    document.getElementById("chatInputBar").style.display = "flex";
    const thread = document.getElementById("chatThread");
    thread.innerHTML = `<div class="empty-hint">Đang tải tin nhắn...</div>`;
 
    const res = await apiFetch(`/chat/${customerId}`);
    thread.innerHTML = "";
    if (res.success && Array.isArray(res.data)) {
        res.data.forEach(appendBubble);
    }
    // Cập nhật lại danh sách để xóa badge chưa đọc
    loadConversations();
}
 
async function sendAdminMessage() {
    const input = document.getElementById("adminChatInput");
    const noi_dung = input.value.trim();
    if (!noi_dung || !currentCustomerId) return;
    input.value = "";
 
    const res = await apiFetch(`/chat/${currentCustomerId}`, { method: "POST", body: { noi_dung } });
    if (res.success && res.data) {
        appendBubble(res.data);
        loadConversations();
    } else {
        alert(res.message || "Không gửi được tin nhắn!");
    }
}
 
function initAdminSocket() {
    if (typeof io === "undefined") return;
    const socket = io(SERVER_URL, { transports: ["websocket", "polling"] });
    socket.on("connect", () => socket.emit("chat:join", { role: "admin" }));
    socket.on("chat:new", (msg) => {
        if (currentCustomerId && String(msg.id_khach_hang) === String(currentCustomerId)) {
            appendBubble(msg);
        }
        loadConversations();
    });
}
 
document.addEventListener("DOMContentLoaded", () => {
    loadConversations();
    initAdminSocket();
    document.getElementById("adminChatSend").addEventListener("click", sendAdminMessage);
    document.getElementById("adminChatInput").addEventListener("keydown", (e) => {
        if (e.key === "Enter") sendAdminMessage();
    });
});