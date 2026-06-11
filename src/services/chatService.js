const Chat = require('../models/chatModel');
const User = require('../models/userModel');

/**
 * Lưu tin nhắn chat vào MongoDB
 */
const saveMessage = async ({ from, to, message, senderRole, receiverRole }) => {
    return await Chat.create({ from, to, message, senderRole, receiverRole });
};

/**
 * Lấy toàn bộ cuộc hội thoại giữa hai user
 */
const getConversation = async (userId, counterpartId) => {
    return await Chat.find({
        $or: [
            { from: userId, to: counterpartId },
            { from: counterpartId, to: userId }
        ]
    })
    .sort({ createdAt: 1 })
    .populate('from', 'ho_ten email vai_tro')
    .populate('to', 'ho_ten email vai_tro');
};

/**
 * Lấy tất cả tin nhắn của một user
 */
const getChatsForUser = async (userId) => {
    return await Chat.find({
        $or: [
            { from: userId },
            { to: userId }
        ]
    })
    .sort({ createdAt: 1 })
    .populate('from', 'ho_ten email vai_tro')
    .populate('to', 'ho_ten email vai_tro');
};

/**
 * Lấy danh sách khách hàng đã trao đổi với admin để hiển thị trên admin chat
 */
const getCustomerThreads = async () => {
    const chats = await Chat.find({
        $or: [
            { senderRole: 'customer' },
            { receiverRole: 'customer' }
        ]
    })
    .sort({ createdAt: -1 })
    .populate('from', 'ho_ten email vai_tro')
    .populate('to', 'ho_ten email vai_tro');

    const threadMap = new Map();
    chats.forEach((chat) => {
        const customer = chat.senderRole === 'customer' ? chat.from : chat.to;
        if (!customer) return;
        const id = customer._id.toString();
        if (!threadMap.has(id)) {
            threadMap.set(id, {
                customerId: id,
                customerName: customer.ho_ten,
                customerEmail: customer.email,
                lastMessage: chat.message,
                lastAt: chat.createdAt
            });
        }
    });

    return Array.from(threadMap.values());
};

/**
 * Tìm một admin đầu tiên để khách hàng gửi tin nhắn mặc định
 */
const getDefaultAdmin = async () => {
    return await User.findOne({ vai_tro: 'admin' }).select('_id ho_ten email');
};

module.exports = {
    saveMessage,
    getConversation,
    getChatsForUser,
    getCustomerThreads,
    getDefaultAdmin
};