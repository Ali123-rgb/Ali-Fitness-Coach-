const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  markedAt: {
    type: Date,
    default: Date.now
  },
  qrCode: {
    type: String,
    required: true
  },
  sessionType: {
    type: String,
    enum: ['Training', 'Workout', 'Diet Consultation'],
    required: true
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Late'],
    default: 'Present'
  },
  notes: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('Attendance', attendanceSchema);