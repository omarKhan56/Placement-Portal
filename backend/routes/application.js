//backend/routes/application.js

const express = require('express');
const router = express.Router();
const {
  createApplication,
  getMyApplications,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  mentorAction,
  deleteApplication,
} = require('../controllers/applicationController');

const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

/* ================================
   STUDENT ROUTES
================================ */

// Apply for internship
router.post('/', protect, roleCheck(['student']), createApplication);

// Get all applications of logged-in student
router.get('/my-applications', protect, roleCheck(['student']), getMyApplications);

/* ================================
   ADMIN / MENTOR / EMPLOYER ROUTES
================================ */

// Get all applications (mentors see pending, others can filter by status)
router.get('/', protect, roleCheck(['mentor', 'placement_cell', 'employer']), getAllApplications);

// Get single application by ID
router.get('/:id', protect, getApplicationById);

// Update application status (placement_cell / employer)
router.put('/:id/status', protect, roleCheck(['placement_cell', 'employer']), updateApplicationStatus);

// Mentor action: approve / reject
router.put('/:id/mentor-action', protect, roleCheck(['mentor']), mentorAction);

// Delete application (placement_cell)
router.delete('/:id', protect, roleCheck(['placement_cell']), deleteApplication);

module.exports = router;
