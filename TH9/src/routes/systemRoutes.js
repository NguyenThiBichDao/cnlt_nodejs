const express = require('express');
const router = express.Router();
// Đảm bảo đường dẫn này đúng trỏ đến file controller
const systemController = require('../controllers/systemController');

// Kiểm tra kỹ tên hàm sau dấu chấm phải khớp với tên bên Controller
router.get('/heavy-sync', systemController.heavySync);
router.get('/heavy-async', systemController.heavyAsync);

module.exports = router;
