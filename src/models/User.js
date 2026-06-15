const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide first name'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Please provide last name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
    select: false
  },
  phone: {
    type: String,
    required: [true, 'Please provide phone number']
  },
  age: {
    type: Number,
    required: [true, 'Please provide age']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Please provide gender']
  },
  fitnessGoal: {
    type: String,
    enum: ['Weight Loss', 'Muscle Gain', 'Endurance', 'Flexibility', 'General Health'],
    default: 'General Health'
  },
  membershipType: {
    type: String,
    enum: ['Basic', 'Premium', 'Elite'],
    default: 'Basic'
  },
  enrolledDiet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DietPlan',
    default: null
  },
  enrolledTraining: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrainingSession',
    default: null
  },
  enrolledWorkout: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkoutPlan',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);