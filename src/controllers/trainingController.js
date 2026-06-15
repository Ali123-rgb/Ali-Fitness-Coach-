const TrainingSession = require('../models/TrainingSession');
const User = require('../models/User');

exports.getAllTrainingSessions = async (req, res) => {
  try {
    const { page = 1, limit = 10, level, type } = req.query;

    let query = {};
    if (level) query.level = level;
    if (type) query.trainingType = type;

    const sessions = await TrainingSession.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await TrainingSession.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      sessions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTrainingSessionById = async (req, res) => {
  try {
    const session = await TrainingSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ error: 'Training session not found' });
    }

    res.status(200).json({
      success: true,
      session
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.enrollTrainingSession = async (req, res) => {
  try {
    const userId = req.userId;
    const sessionId = req.params.id;

    const session = await TrainingSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Training session not found' });
    }

    // Check capacity
    if (session.currentParticipants >= session.maxParticipants) {
      return res.status(400).json({ error: 'Session is full' });
    }

    // Add user to enrolled users
    if (!session.enrolledUsers.includes(userId)) {
      session.enrolledUsers.push(userId);
      session.currentParticipants += 1;
      await session.save();
    }

    // Update user's enrolled training
    await User.findByIdAndUpdate(userId, { enrolledTraining: sessionId });

    res.status(200).json({
      success: true,
      message: 'Enrolled in training session successfully',
      session
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createTrainingSession = async (req, res) => {
  try {
    const { title, description, trainer, trainingType, level, duration, schedule, maxParticipants, price, exercises } = req.body;

    const session = new TrainingSession({
      title,
      description,
      trainer,
      trainingType,
      level,
      duration,
      schedule,
      maxParticipants,
      currentParticipants: 0,
      price,
      exercises
    });

    await session.save();

    res.status(201).json({
      success: true,
      message: 'Training session created successfully',
      session
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};