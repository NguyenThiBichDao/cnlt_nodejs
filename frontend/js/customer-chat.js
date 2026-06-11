document.addEventListener('DOMContentLoaded', () => {
    const messageContainer = document.getElementById('messageContainer');
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');

    if (!token) {
        alert('Bạn cần đăng nhập để truy cập chat.');
        window.location.href = '../auth/login.html';
        return;
    }

    let userId = null;
    try {
        const userData = JSON.parse(userString);
        userId = userData._id;
    } catch (e) {}

    const socket = io({ 
        auth: { token },
        transports: ['websocket', 'polling']
    });

    const appendMessage = (message, owner, timestamp) => {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${owner}`;
        const timeStr = timestamp ? new Date(timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '';
        bubble.innerHTML = `<p>${message}</p>${timeStr ? `<span class="time">${timeStr}</span>` : ''}`;
        messageContainer.appendChild(bubble);
        messageContainer.scrollTop = messageContainer.scrollHeight;
    };

    const loadHistory = async () => {
        const response = await apiFetch('/chat/my');
        if (response.success) {
            messageContainer.innerHTML = '';
            response.data.forEach(item => {
                const owner = item.from?._id === userId || item.senderRole === 'customer' ? 'self' : 'other';
                appendMessage(item.message, owner, item.createdAt);
            });
        }
    };

    socket.on('connect', () => {
        loadHistory();
    });

    socket.on('receive-message', (payload) => {
        if (payload && payload.from && payload.from !== userId) {
            appendMessage(payload.message, 'other', payload.createdAt);
        }
    });

    socket.on('message-sent', (payload) => {
        if (payload && payload.from === userId) {
            appendMessage(payload.message, 'self', payload.createdAt);
        }
    });

    const sendMessage = () => {
        const message = messageInput.value.trim();
        if (!message) return;

        socket.emit('send-message', { message });
        messageInput.value = '';
    };

    sendMessageBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
});