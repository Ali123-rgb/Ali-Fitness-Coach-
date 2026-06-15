const DietPlan = require('../models/DietPlan');
const User = require('../models/User');

exports.getAllDietPlans = async (req, res) => {
  try {
    const { page = 1, limit = 10, level } = req.query;

    let query = {};
    if (level) query.level = level;

    const dietPlans = await DietPlan.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await DietPlan.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      dietPlans
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDietPlanById = async (req, res) => {
  try {
    const dietPlan = await DietPlan.findById(req.params.id);

    if (!dietPlan) {
      return res.status(404).json({ error: 'Diet plan not found' });
    }

    res.status(200).json({
      success: true,
      dietPlan
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.enrollDietPlan = async (req, res) => {
  try {
    const userId = req.userId;
    const dietPlanId = req.params.id;

    const dietPlan = await DietPlan.findById(dietPlanId);
    if (!dietPlan) {
      return res.status(404).json({ error: 'Diet plan not found' });
    }

    // Add user to enrolled users
    if (!dietPlan.enrolledUsers.includes(userId)) {
      dietPlan.enrolledUsers.push(userId);
      await dietPlan.save();
    }

    // Update user's enrolled diet
    await User.findByIdAndUpdate(userId, { enrolledDiet: dietPlanId });

    res.status(200).json({
      success: true,
      message: 'Enrolled in diet plan successfully',
      dietPlan
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createDietPlan = async (req, res) => {
  try {
    const { title, description, dietician, duration, mealType, calorieTarget, ingredients, schedule, price } = req.body;

    const dietPlan = new DietPlan({
      title,
      description,
      dietician,
      duration,
      mealType,
      calorieTarget,
      ingredients,
      schedule,
      price
    });

    await dietPlan.save();

    res.status(201).json({
      success: true,
      message: 'Diet plan created successfully',
      dietPlan
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};