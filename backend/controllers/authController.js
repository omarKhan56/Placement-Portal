const User = require('../models/User');
const Student = require('../models/Student');
const jwt = require('jsonwebtoken');
const sendEmail = require('../config/nodemailer');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { email, password, role, fullName, studentId, department, semester } = req.body;

    console.log('📝 Registration attempt:', { email, role });

    // Validate required fields
    if (!email || !password || !role) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide email, password, and role' 
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists with this email' 
      });
    }

    // Validate student-specific fields
    if (role === 'student') {
      if (!fullName || !studentId || !department || !semester) {
        return res.status(400).json({ 
          success: false,
          message: 'Please provide all required student information' 
        });
      }

      // Check if studentId already exists
      const studentExists = await Student.findOne({ studentId });
      if (studentExists) {
        return res.status(400).json({ 
          success: false,
          message: 'Student ID already exists' 
        });
      }
    }

    // Create user
    const user = await User.create({
      email,
      password,
      role,
      isVerified: true, // Auto-verify for now
    });

    console.log('✅ User created:', user._id);

    // If student, create student profile
    if (role === 'student') {
      const student = await Student.create({
        userId: user._id,
        fullName,
        studentId,
        department,
        semester: parseInt(semester),
      });
      console.log('✅ Student profile created:', student._id);
    }

    // Send welcome email (wrap in try-catch to not fail registration)
    try {
      await sendEmail({
        to: email,
        subject: 'Welcome to Placement Portal',
        html: `<p>Welcome ${fullName || email}! Your account has been created successfully.</p>`,
      });
      console.log('✅ Welcome email sent');
    } catch (emailError) {
      console.log('⚠️ Email not sent (not critical):', emailError.message);
      // Don't fail registration if email fails
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Registration failed. Please try again.' 
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Login attempt:', email);

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide email and password' 
      });
    }

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    const token = generateToken(user._id);

    console.log('✅ Login successful:', user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Login failed. Please try again.' 
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    let profile = null;
    if (user.role === 'student') {
      profile = await Student.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      user,
      profile,
    });
  } catch (error) {
    console.error('❌ Get user error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};