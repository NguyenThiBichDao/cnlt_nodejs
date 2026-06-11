// src/routes/index.js
const express = require('express');
const router = express.Router();
  
// 1. Nạp các tuyến đường (routes) hợp lệ
const authRoutes = require('./authRoutes');
const bikeRoutes = require('./bikeRoutes');
const rentalRoutes = require('./rentalRoutes');
const paymentRoutes = require('./paymentRoutes');
const userRoutes = require('./userRoutes');
const reviewRoutes = require('./reviewRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const chatRoutes = require('./chatRoutes');
const uploadRoutes = require('./uploadRoutes');
  
// 2. Định nghĩa tiền tố API cho từng nhóm tính năng
router.use('/auth', authRoutes);
router.use('/bikes', bikeRoutes);
router.use('/rentals', rentalRoutes);
router.use('/payments', paymentRoutes);
router.use('/users', userRoutes);
router.use('/reviews', reviewRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/chat', chatRoutes);
router.use('/upload', uploadRoutes);
  
module.exports = router;