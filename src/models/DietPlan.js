const mongoose = require('mongoose');

const dietPlanSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide diet plan title'],
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  dietician: {
    type: String,
    required: [true, 'Please provide dietician name']
  },
  duration: {
    type: String,
    enum: ['1 Week', '2 Weeks', '1 Month', '3 Months', '6 Months'],
    required: true
  },
  mealType: {
    type: [String],
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks'],
    required: true
  },
  calorieTarget: {
    type: Number,
    required: true
  },
  ingredients: [{
    name: String,
    quantity: String,
    protein: Number,
    carbs: Number,
    fat: Number
  }],
  schedule: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String
  },
  price: {
    type: Number,
    required: true
  },
  enrolledUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DietPlan', dietPlanSchema);