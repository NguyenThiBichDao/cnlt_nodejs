const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');
const { protect, restrictTo } = require('../middleware/routeHelper');

router.use(protect);

router.get('/', rentalController.getAllRentals);
router.post('/', restrictTo('customer'), rentalController.createRental);
router.patch('/:id/cancel', rentalController.cancelRental);
router.delete('/:id', restrictTo('customer'), rentalController.cancelRental);
router.put('/:id/approve', restrictTo('admin'), rentalController.approveRental);

module.exports = router;