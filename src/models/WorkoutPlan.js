const mongoose = require('mongoose');

const workoutPlanSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide workout plan title'],
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  trainer: {
    type: String,
    required: [true, 'Please provide trainer name']
  },
  workoutType: {
    type: String,
    enum: ['Home', 'Gym', 'Outdoor', 'Hybrid'],
    required: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  targetMuscles: [String],
  duration: {
    type: Number,
    required: true
  },
  frequency: {
    type: String,
    enum: ['3x/week', '4x/week', '5x/week', '6x/week'],
    required: true
  },
  equipment: [String],
  exercises: [{
    name: String,
    sets: Number,
    reps: String,
    rest: String,
    instructions: String,
    videoUrl: String
  }],
  progression: [{
    week: Number,
    modifications: String
  }],
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

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);