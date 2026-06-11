const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    senderRole: { type: String, enum: ['admin', 'customer'], required: true },
    receiverRole: { type: String, enum: ['admin', 'customer'], required: true },
    isRead: { type: Boolean, default: false }
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

module.exports = mongoose.model('Chat', chatSchema, 'chats');