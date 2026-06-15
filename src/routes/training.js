const express = require('express');
const trainingController = require('../controllers/trainingController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', trainingController.getAllTrainingSessions);
router.get('/:id', trainingController.getTrainingSessionById);
router.post('/create', authMiddleware, trainingController.createTrainingSession);
router.post('/:id/enroll', authMiddleware, trainingController.enrollTrainingSession);

module.exports = router;