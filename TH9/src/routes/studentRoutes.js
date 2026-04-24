const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// API thống kê (Phần 5)
router.post('/students', studentController.addStudent); 

router.get('/students', studentController.getAllStudents);
router.get('/students/stats', studentController.getStats);
router.get('/students/stats/class', studentController.getStatsByClass);
router.delete('/students/:id', studentController.deleteStudent);
module.exports = router;