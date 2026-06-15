const qrcode = require('qrcode');
const Attendance = require('../models/Attendance');
const User = require('../models/User');

exports.generateQRCode = async (req, res) => {
  try {
    const { sessionType } = req.body;

    if (!sessionType) {
      return res.status(400).json({ error: 'Session type is required' });
    }

    const qrData = `${process.env.QR_CODE_SECRET}_${Date.now()}`;
    const qrImage = await qrcode.toDataURL(qrData);

    res.status(200).json({
      success: true,
      qrCode: qrImage,
      qrData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const { qrCode, sessionType } = req.body;
    const userId = req.userId;

    if (!qrCode || !sessionType) {
      return res.status(400).json({ error: 'QR Code and session type are required' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create attendance record
    const attendance = new Attendance({
      userId,
      qrCode,
      sessionType,
      status: 'Present'
    });

    await attendance.save();

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      attendance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAttendanceHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const { startDate, endDate } = req.query;

    let query = { userId };

    if (startDate || endDate) {
      query.markedAt = {};
      if (startDate) query.markedAt.$gte = new Date(startDate);
      if (endDate) query.markedAt.$lte = new Date(endDate);
    }

    const attendance = await Attendance.find(query).sort({ markedAt: -1 });

    res.status(200).json({
      success: true,
      total: attendance.length,
      attendance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAttendanceStats = async (req, res) => {
  try {
    const userId = req.userId;

    const totalSessions = await Attendance.countDocuments({ userId });
    const presentSessions = await Attendance.countDocuments({ userId, status: 'Present' });
    const lateSessions = await Attendance.countDocuments({ userId, status: 'Late' });
    const absentSessions = await Attendance.countDocuments({ userId, status: 'Absent' });

    const attendanceRate = totalSessions > 0 ? ((presentSessions / totalSessions) * 100).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalSessions,
        presentSessions,
        lateSessions,
        absentSessions,
        attendanceRate: `${attendanceRate}%`
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};