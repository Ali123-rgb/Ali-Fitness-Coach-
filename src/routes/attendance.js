const express = require('express');
const attendanceController = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/generate-qr', authMiddleware, attendanceController.generateQRCode);
router.post('/mark', authMiddleware, attendanceController.markAttendance);
router.get('/history', authMiddleware, attendanceController.getAttendanceHistory);
router.get('/stats', authMiddleware, attendanceController.getAttendanceStats);

module.exports = router;