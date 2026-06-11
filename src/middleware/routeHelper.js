const authMiddleware = require('./authMiddleware');
const roleMiddleware = require('./roleMiddleware');

const protect = typeof authMiddleware === 'function' ? authMiddleware : authMiddleware.protect;
const restrictTo = typeof roleMiddleware === 'function' ? roleMiddleware : roleMiddleware.restrictTo;

module.exports = { protect, restrictTo };