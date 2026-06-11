const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/routeHelper');

router.get('/stats', async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                totalRevenue: 0,
                totalRentals: 0,
                totalUsers: 0
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;