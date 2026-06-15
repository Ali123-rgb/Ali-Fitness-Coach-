const express = require('express');
const workoutController = require('../controllers/workoutController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', workoutController.getAllWorkoutPlans);
router.get('/:id', workoutController.getWorkoutPlanById);
router.post('/create', authMiddleware, workoutController.createWorkoutPlan);
router.post('/:id/enroll', authMiddleware, workoutController.enrollWorkoutPlan);

module.exports = router;