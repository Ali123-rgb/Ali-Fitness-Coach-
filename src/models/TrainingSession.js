const mongoose = require('mongoose');

const trainingSessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide training title'],
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
  trainingType: {
    type: String,
    enum: ['Strength', 'Cardio', 'Flexibility', 'Balance', 'Mixed'],
    required: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  schedule: {
    startDate: Date,
    endDate: Date,
    daysPerWeek: Number,
    timings: [String]
  },
  maxParticipants: {
    type: Number,
    required: true
  },
  currentParticipants: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: true
  },
  exercises: [{
    name: String,
    sets: Number,
    reps: String,
    instructions: String
  }],
  enrolledUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TrainingSession', trainingSessionSchema);