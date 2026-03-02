//backend/routes/internship.js

const express = require('express');
const router = express.Router();

const {
  createInternship,
  getAllInternships,
  getInternshipById,
  updateInternship,
  deleteInternship,
  getRecommendedInternshipsForStudent,
} = require('../controllers/internshipController');

const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

// Public routes (protected)
router.get('/', protect, getAllInternships);
router.get('/recommended', protect, roleCheck(['student']), getRecommendedInternshipsForStudent);
router.get('/:id', protect, getInternshipById);

// Protected routes - Placement Cell & Employer
router.post('/', protect, roleCheck(['placement_cell', 'employer']), createInternship);
router.put('/:id', protect, roleCheck(['placement_cell', 'employer']), updateInternship);
router.delete('/:id', protect, roleCheck(['placement_cell', 'employer']), deleteInternship);

module.exports = router;
