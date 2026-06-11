const chatService = require('../services/chatService');
const responseHelper = require('../utils/responseHelper');

const sendMessage = async (req, res) => {
    try {
        const senderId = req.user?.id;
        const { to, message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json(responseHelper.error('Nội dung tin nhắn không được để trống!'));
        }

        let receiverId = to;
        if (!receiverId && req.user?.role === 'customer') {
            const admin = await chatService.getDefaultAdmin();
            if (!admin) {
                return res.status(404).json(responseHelper.error('Không tìm thấy admin để gửi tin nhắn!'));
            }
            receiverId = admin._id;
        }

        const saved = await chatService.saveMessage({
            from: senderId,
            to: receiverId,
            message: message.trim(),
            senderRole: req.user?.role,
            receiverRole: req.user?.role === 'admin' ? 'customer' : 'admin'
        });

        const populated = await saved.populate('from to', 'ho_ten email vai_tro');

        return res.status(201).json(responseHelper.success(populated, 'Gửi tin nhắn thành công!'));
    } catch (error) {
        return res.status(500).json(responseHelper.error(error.message || 'Lỗi gửi tin nhắn!'));
    }
};

const getMyChats = async (req, res) => {
    try {
        const userId = req.user?.id;
        const chats = await chatService.getChatsForUser(userId);
        return res.status(200).json(responseHelper.success(chats));
    } catch (error) {
        return res.status(500).json(responseHelper.error(error.message || 'Lỗi tải tin nhắn!'));
    }
};

const getChatThreads = async (req, res) => {
    try {
        const threads = await chatService.getCustomerThreads();
        return res.status(200).json(responseHelper.success(threads));
    } catch (error) {
        return res.status(500).json(responseHelper.error(error.message || 'Lỗi tải danh sách hội thoại!'));
    }
};

const getConversationByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const authUserId = req.user?.id;
        const authUserRole = req.user?.role;

        if (authUserRole !== 'admin' && authUserId !== userId) {
            return res.status(403).json(responseHelper.error('Bạn không có quyền xem cuộc hội thoại này.'));
        }

        const conversation = await chatService.getConversation(authUserId, userId);
        return res.status(200).json(responseHelper.success(conversation));
    } catch (error) {
        return res.status(500).json(responseHelper.error(error.message || 'Lỗi tải cuộc hội thoại!'));
    }
};

module.exports = {
    sendMessage,
    getMyChats,
    getChatThreads,
    getConversationByUser
};