const express = require('express');
const dietController = require('../controllers/dietController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', dietController.getAllDietPlans);
router.get('/:id', dietController.getDietPlanById);
router.post('/create', authMiddleware, dietController.createDietPlan);
router.post('/:id/enroll', authMiddleware, dietController.enrollDietPlan);

module.exports = router;