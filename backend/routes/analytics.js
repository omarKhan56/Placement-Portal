//backend/routes/analytics.js

const express = require('express');
const router = express.Router();
const {
  getAnalyticsDashboard,
  getInterviewSchedule,
  getSkillGapAnalysis,
} = require('../controllers/analyticsController'); // only import what exists
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

// All analytics routes require placement_cell or mentor/employer roles
router.get(
  '/dashboard',
  protect,
  roleCheck(['placement_cell', 'mentor', 'employer']),
  getAnalyticsDashboard
);

router.get(
  '/interview-schedule',
  protect,
  roleCheck(['placement_cell', 'employer']),
  getInterviewSchedule
);

router.get(
  '/skill-gap',
  protect,
  roleCheck(['placement_cell', 'mentor']),
  getSkillGapAnalysis
);

// If you want department-wise analytics, implement it in the controller first
// router.get(
//   '/department-wise',
//   protect,
//   roleCheck(['placement_cell']),
//   getDepartmentWiseAnalysis
// );

module.exports = router;
