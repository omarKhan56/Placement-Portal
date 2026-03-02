//backend/controllers/analyticsController.js
const Application = require('../models/Application');
const Internship = require('../models/Internship');
const Student = require('../models/Student');
const Feedback = require('../models/Feedback');

// @desc    Get placement analytics dashboard
// @route   GET /api/analytics/dashboard
exports.getAnalyticsDashboard = async (req, res) => {
  try {
    // Total students
    const totalStudents = await Student.countDocuments();

    // Total internships
    const totalInternships = await Internship.countDocuments({ isActive: true });

    // Total applications
    const totalApplications = await Application.countDocuments();

    // Applications by status
    const applicationsByStatus = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Students placed
    const studentsPlaced = await Application.countDocuments({ status: 'selected' });

    // Unfilled seats
    const unfilled = await Internship.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalSeats: { $sum: '$totalSeats' },
          seatsRemaining: { $sum: '$seatsRemaining' },
        },
      },
    ]);

    // Department-wise placement stats
    const departmentStats = await Application.aggregate([
      { $match: { status: 'selected' } },
      {
        $lookup: {
          from: 'students',
          localField: 'studentId',
          foreignField: '_id',
          as: 'student',
        },
      },
      { $unwind: '$student' },
      {
        $group: {
          _id: '$student.department',
          count: { $sum: 1 },
        },
      },
    ]);

    // Recent applications
    const recentApplications = await Application.find()
      .populate('studentId', 'fullName studentId department')
      .populate('internshipId', 'title company')
      .sort({ appliedAt: -1 })
      .limit(10);

    // Top skills in demand
    const topSkills = await Internship.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$requiredSkills' },
      {
        $group: {
          _id: '$requiredSkills',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalStudents,
          totalInternships,
          totalApplications,
          studentsPlaced,
          placementRate: totalStudents > 0 ? ((studentsPlaced / totalStudents) * 100).toFixed(2) : 0,
        },
        applicationsByStatus,
        unfilled: unfilled[0] || { totalSeats: 0, seatsRemaining: 0 },
        departmentStats,
        recentApplications,
        topSkills,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get weekly interview schedule
// @route   GET /api/analytics/interview-schedule
exports.getInterviewSchedule = async (req, res) => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const interviews = await Application.find({
      status: 'interview_scheduled',
      interviewDate: {
        $gte: startOfWeek,
        $lt: endOfWeek,
      },
    })
      .populate('studentId', 'fullName studentId')
      .populate('internshipId', 'title company')
      .sort({ interviewDate: 1 });

    res.json({
      success: true,
      data: interviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get skill gap analysis
// @route   GET /api/analytics/skill-gap
exports.getSkillGapAnalysis = async (req, res) => {
  try {
    // Skills required by internships
    const requiredSkills = await Internship.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$requiredSkills' },
      {
        $group: {
          _id: '$requiredSkills',
          demand: { $sum: 1 },
        },
      },
    ]);

    // Skills possessed by students
    const studentSkills = await Student.aggregate([
      { $unwind: '$skills' },
      {
        $group: {
          _id: '$skills',
          supply: { $sum: 1 },
        },
      },
    ]);

    // Merge and calculate gap
    const skillMap = {};

    requiredSkills.forEach(item => {
      skillMap[item._id] = { skill: item._id, demand: item.demand, supply: 0 };
    });

    studentSkills.forEach(item => {
      if (skillMap[item._id]) {
        skillMap[item._id].supply = item.supply;
      }
    });

    const skillGap = Object.values(skillMap).map(item => ({
      ...item,
      gap: item.demand - item.supply,
    })).sort((a, b) => b.gap - a.gap);

    res.json({
      success: true,
      data: skillGap,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};