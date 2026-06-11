const express = require('express');
const router = express.Router();
const bikeController = require('../controllers/bikeController');
const { protect, restrictTo } = require('../middleware/routeHelper');

const getAllBikes = bikeController.getAllBikes || ((req, res) => res.json([]));
const getBikeById = bikeController.getBikeById || ((req, res) => res.json({}));
const createBike = bikeController.createBike || ((req, res) => res.json({}));
const updateBike = bikeController.updateBike || ((req, res) => res.json({}));
const deleteBike = bikeController.deleteBike || ((req, res) => res.json({}));

router.get('/', getAllBikes);
router.get('/:id', getBikeById);
router.post('/', protect, restrictTo('admin'), createBike);
router.put('/:id', protect, restrictTo('admin'), updateBike);
router.delete('/:id', protect, restrictTo('admin'), deleteBike);

module.exports = router;