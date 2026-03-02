//backend/controllers/internshipController.js

const Internship = require('../models/Internship');
const Student = require('../models/Student');
const { getRecommendedInternships } = require('../utils/matchingAlgorithm');

// @desc    Create internship
// @route   POST /api/internship
exports.createInternship = async (req, res) => {
  try {
    const internship = await Internship.create({
      ...req.body,
      postedBy: req.user.id,
      seatsRemaining: req.body.totalSeats,
    });

    res.status(201).json({
      success: true,
      data: internship,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all internships
// @route   GET /api/internship
exports.getAllInternships = async (req, res) => {
  try {
    const { department, mode, search } = req.query;
    let query = { isActive: true };

    if (department) query.eligibleDepartments = department;
    if (mode) query.mode = mode;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    const internships = await Internship.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: internships.length,
      data: internships,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recommended internships for student
// @route   GET /api/internship/recommended
exports.getRecommendedInternshipsForStudent = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });

    const internships = await Internship.find({ 
      isActive: true,
      eligibleDepartments: student.department,
    });

    const recommended = getRecommendedInternships(student, internships);

    res.json({
      success: true,
      data: recommended,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single internship by ID
// @route   GET /api/internship/:id
exports.getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) return res.status(404).json({ message: 'Internship not found' });

    res.json({
      success: true,
      data: internship,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update internship
// @route   PUT /api/internship/:id
exports.updateInternship = async (req, res) => {
  try {
    const internship = await Internship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!internship) return res.status(404).json({ message: 'Internship not found' });

    res.json({ success: true, data: internship });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete internship
// @route   DELETE /api/internship/:id
exports.deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) return res.status(404).json({ message: 'Internship not found' });

    // Soft delete
    internship.isActive = false;
    await internship.save();

    res.json({ success: true, message: 'Internship deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
