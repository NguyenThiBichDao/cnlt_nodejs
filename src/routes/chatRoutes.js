const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect, restrictTo } = require('../middleware/routeHelper');

router.use(protect);

router.get('/my', chatController.getMyChats);
router.get('/threads', restrictTo('admin'), chatController.getChatThreads);
router.get('/conversations', restrictTo('admin'), chatController.getChatThreads);
router.get('/:userId', chatController.getConversationByUser);
router.post('/:userId', chatController.sendMessage);
router.post('/', restrictTo('customer'), chatController.sendMessage);

module.exports = router;