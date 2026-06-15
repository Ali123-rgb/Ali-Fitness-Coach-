const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, dashboardController.getDashboard);
router.get('/stats', authMiddleware, dashboardController.getQuickStats);

module.exports = router;