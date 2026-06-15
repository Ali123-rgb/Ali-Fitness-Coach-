const DietPlan = require('../models/DietPlan');
const TrainingSession = require('../models/TrainingSession');
const WorkoutPlan = require('../models/WorkoutPlan');
const User = require('../models/User');

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.userId;

    // Get user details
    const user = await User.findById(userId)
      .populate('enrolledDiet')
      .populate('enrolledTraining')
      .populate('enrolledWorkout');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get all available plans
    const allDietPlans = await DietPlan.find().limit(6);
    const allTrainingSessions = await TrainingSession.find().limit(6);
    const allWorkoutPlans = await WorkoutPlan.find().limit(6);

    res.status(200).json({
      success: true,
      dashboard: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          membershipType: user.membershipType,
          fitnessGoal: user.fitnessGoal,
          age: user.age,
          gender: user.gender
        },
        enrolledPrograms: {
          dietPlan: user.enrolledDiet,
          trainingSession: user.enrolledTraining,
          workoutPlan: user.enrolledWorkout
        },
        availablePrograms: {
          dietPlans: allDietPlans,
          trainingSessions: allTrainingSessions,
          workoutPlans: allWorkoutPlans
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getQuickStats = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const enrolledPrograms = [
      user.enrolledDiet ? 1 : 0,
      user.enrolledTraining ? 1 : 0,
      user.enrolledWorkout ? 1 : 0
    ].reduce((a, b) => a + b, 0);

    res.status(200).json({
      success: true,
      stats: {
        membershipType: user.membershipType,
        fitnessGoal: user.fitnessGoal,
        enrolledPrograms,
        joinedDate: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};