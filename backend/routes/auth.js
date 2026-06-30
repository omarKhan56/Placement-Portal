//backend/routes/auth.js

const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  loginLimiter,
  registerLimiter,
} = require('../middleware/rateLimiter');

// Public routes
router.post(
  '/register',
  registerLimiter,
  register
);
router.post(
  '/login',
  loginLimiter,
  login
);

// Protected route
router.get('/me', protect, getMe);

module.exports = router;