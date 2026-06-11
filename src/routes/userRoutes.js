const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const authMiddleware = require('../middleware/authMiddleware');
const protect = typeof authMiddleware === 'function' ? authMiddleware : authMiddleware.protect;

const roleMiddleware = require('../middleware/roleMiddleware');
const restrictTo = typeof roleMiddleware === 'function' ? roleMiddleware : roleMiddleware.restrictTo;

const getAllUsers = userController.getAllUsers || ((req, res) => res.json([]));
const toggleUserStatus = userController.toggleUserStatus || ((req, res) => res.json({}));

router.get('/', protect, restrictTo('admin'), getAllUsers);
router.put('/:id/toggle', protect, restrictTo('admin'), toggleUserStatus);

module.exports = router;
