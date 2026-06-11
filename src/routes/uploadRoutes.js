const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const uploadController = require('../controllers/uploadController');
const { protect, restrictTo } = require('../middleware/routeHelper');

router.post('/', protect, restrictTo('admin'), upload.single('image'), uploadController.uploadImage);

module.exports = router;