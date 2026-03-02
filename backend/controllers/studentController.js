//backend/controllers/studentController.js

const Student = require('../models/Student');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// Get student profile
exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id }).populate('userId', 'email');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Update student profile
exports.updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      semester,
      cgpa,
      coverLetter,
      skills,
      preferences,
      certifications,
    } = req.body;

    let student = await Student.findOne({ userId: req.user._id });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    // Update fields
    if (fullName) student.fullName = fullName;
    if (phone) student.phone = phone;
    if (semester) student.semester = parseInt(semester);
    if (cgpa) student.cgpa = parseFloat(cgpa);
    if (coverLetter) student.coverLetter = coverLetter;

    // Parse JSON strings if needed
    if (skills) {
      student.skills = typeof skills === 'string' ? JSON.parse(skills) : skills;
    }
    if (preferences) {
      student.preferences = typeof preferences === 'string' ? JSON.parse(preferences) : preferences;
    }
    if (certifications) {
      student.certifications = typeof certifications === 'string' ? JSON.parse(certifications) : certifications;
    }

    // Check if profile is complete
    student.profileCompleted = !!(
      student.fullName &&
      student.semester &&
      student.cgpa &&
      student.skills &&
      student.skills.length >= 3 &&
      student.resumeUrl
    );

    // Calculate employability score
    student.employabilityScore = calculateEmployabilityScore(student);

    await student.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: student,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Upload resume to Cloudinary
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const student = await Student.findOne({ userId: req.user._id });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found',
      });
    }

    // Upload to Cloudinary using stream
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'placement-portal/resumes',
        resource_type: 'auto',
        public_id: `resume_${student._id}_${Date.now()}`,
      },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({
            success: false,
            message: 'Failed to upload resume',
            error: error.message,
          });
        }

        // Save resume URL to student profile
        student.resumeUrl = result.secure_url;

        // Update profile completion status
        student.profileCompleted = !!(
          student.fullName &&
          student.semester &&
          student.cgpa &&
          student.skills &&
          student.skills.length >= 3 &&
          student.resumeUrl
        );

        // Update employability score
        student.employabilityScore = calculateEmployabilityScore(student);

        await student.save();

        res.json({
          success: true,
          message: 'Resume uploaded successfully',
          data: {
            resumeUrl: result.secure_url,
            employabilityScore: student.employabilityScore,
            profileCompleted: student.profileCompleted,
          },
        });
      }
    );

    // Pipe the file buffer to Cloudinary
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Request certification
exports.requestCertification = async (req, res) => {
  try {
    const { applicationId } = req.body;

    if (!applicationId) {
      return res.status(400).json({
        success: false,
        message: 'Application ID is required',
      });
    }

    // TODO: Implement certification generation logic
    // This would typically:
    // 1. Verify the internship is completed
    // 2. Generate PDF certificate
    // 3. Store certificate URL
    // 4. Send email with certificate

    res.json({
      success: true,
      message: 'Certification request received. Certificate will be generated and sent to your email.',
    });
  } catch (error) {
    console.error('Error requesting certification:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Helper function to calculate employability score
function calculateEmployabilityScore(student) {
  let score = 0;

  // Resume uploaded (20 points)
  if (student.resumeUrl) score += 20;

  // Cover letter (10 points)
  if (student.coverLetter && student.coverLetter.length > 50) score += 10;

  // Skills (15 points)
  if (student.skills && student.skills.length >= 5) {
    score += 15;
  } else if (student.skills && student.skills.length > 0) {
    score += student.skills.length * 3;
  }

  // Certifications (15 points)
  if (student.certifications && student.certifications.length >= 2) {
    score += 15;
  } else if (student.certifications && student.certifications.length > 0) {
    score += student.certifications.length * 7;
  }

  // CGPA (40 points)
  if (student.cgpa) {
    const cgpa = parseFloat(student.cgpa);
    if (cgpa >= 9.0) score += 40;
    else if (cgpa >= 8.0) score += 35;
    else if (cgpa >= 7.5) score += 30;
    else if (cgpa >= 7.0) score += 25;
    else if (cgpa >= 6.5) score += 20;
    else score += 10;
  }

  return Math.min(score, 100); // Cap at 100
}