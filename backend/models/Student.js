//backend/models/Student.js

const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
    unique: true,
  },
  department: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  cgpa: {
    type: Number,
    min: 0,
    max: 10,
  },
  phone: String,
  resumeUrl: String,
  coverLetter: String,
  skills: [String],
  certifications: [{
    name: String,
    issuer: String,
    dateObtained: Date,
    certificateUrl: String,
  }],
  preferences: {
    domains: [String],
    locations: [String],
    stipendRange: {
      min: Number,
      max: Number,
    },
    internshipType: {
      type: String,
      enum: ['online', 'offline', 'hybrid'],
    },
  },
  employabilityScore: {
    type: Number,
    default: 0,
  },
  profileCompleted: {
    type: Boolean,
    default: false,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Calculate employability score
studentSchema.methods.calculateEmployabilityScore = function() {
  let score = 0;
  
  if (this.resumeUrl) score += 20;
  if (this.coverLetter) score += 10;
  if (this.skills.length > 0) score += 15;
  if (this.certifications.length > 0) score += 15;
  if (this.cgpa) score += Math.min(this.cgpa * 4, 40);
  
  this.employabilityScore = Math.min(score, 100);
  return this.employabilityScore;
};

module.exports = mongoose.model('Student', studentSchema);