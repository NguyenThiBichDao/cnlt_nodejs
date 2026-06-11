const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect, restrictTo } = require('../middleware/routeHelper');

router.post('/', protect, restrictTo('customer'), reviewController.createReview);
router.get('/bike/:bikeId', reviewController.getBikeReviews);
router.get('/', protect, restrictTo('admin'), reviewController.getAllReviews);
router.delete('/:id', protect, restrictTo('admin'), reviewController.deleteReview);

module.exports = router;