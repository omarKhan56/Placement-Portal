const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  uploadResume,
  requestCertification,
} = require('../controllers/studentController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');
const upload = require('../config/multer');

// All routes require authentication and student role
router.use(protect);
router.use(roleCheck(['student']));

// Get student profile
router.get('/profile', getProfile);

// Update student profile
router.put('/profile', updateProfile);

// Upload resume
router.post('/upload-resume', upload.single('resume'), uploadResume);

// Request certification
router.post('/certification', requestCertification);

module.exports = router;