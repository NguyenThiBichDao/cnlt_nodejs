const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect, restrictTo } = require('../middleware/routeHelper');

router.use(protect);
router.get('/', paymentController.getAllPayments);
router.post('/', paymentController.createPayment);
router.put('/:id', restrictTo('admin'), paymentController.updatePaymentStatus);

module.exports = router;
