const rateLimit = require('express-rate-limit');

// Login limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,

  standardHeaders: true,
  legacyHeaders: false,

  skipSuccessfulRequests: false,

  message: {
    success: false,
    message:
      'Too many login attempts. Please try again after 15 minutes.',
  },
});

// Registration limiter
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message:
      'Too many registration attempts. Please try again after 15 minutes.',
  },
});

module.exports = {
  loginLimiter,
  registerLimiter,
};