const WorkoutPlan = require('../models/WorkoutPlan');
const User = require('../models/User');

exports.getAllWorkoutPlans = async (req, res) => {
  try {
    const { page = 1, limit = 10, level, type } = req.query;

    let query = {};
    if (level) query.level = level;
    if (type) query.workoutType = type;

    const plans = await WorkoutPlan.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await WorkoutPlan.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      plans
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWorkoutPlanById = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ error: 'Workout plan not found' });
    }

    res.status(200).json({
      success: true,
      plan
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.enrollWorkoutPlan = async (req, res) => {
  try {
    const userId = req.userId;
    const planId = req.params.id;

    const plan = await WorkoutPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({ error: 'Workout plan not found' });
    }

    // Add user to enrolled users
    if (!plan.enrolledUsers.includes(userId)) {
      plan.enrolledUsers.push(userId);
      await plan.save();
    }

    // Update user's enrolled workout
    await User.findByIdAndUpdate(userId, { enrolledWorkout: planId });

    res.status(200).json({
      success: true,
      message: 'Enrolled in workout plan successfully',
      plan
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createWorkoutPlan = async (req, res) => {
  try {
    const { title, description, trainer, workoutType, level, targetMuscles, duration, frequency, equipment, exercises, progression, price } = req.body;

    const plan = new WorkoutPlan({
      title,
      description,
      trainer,
      workoutType,
      level,
      targetMuscles,
      duration,
      frequency,
      equipment,
      exercises,
      progression,
      price
    });

    await plan.save();

    res.status(201).json({
      success: true,
      message: 'Workout plan created successfully',
      plan
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};