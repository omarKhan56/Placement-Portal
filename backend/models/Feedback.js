//backend/models/Certificate.js
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  internshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',
    required: true,
  },
  supervisorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  attendance: {
    type: Number,
    min: 0,
    max: 100,
  },
  technicalSkills: {
    type: Number,
    min: 1,
    max: 10,
  },
  communication: {
    type: Number,
    min: 1,
    max: 10,
  },
  teamwork: {
    type: Number,
    min: 1,
    max: 10,
  },
  problemSolving: {
    type: Number,
    min: 1,
    max: 10,
  },
  overallRating: {
    type: Number,
    min: 1,
    max: 10,
  },
  comments: String,
  skillsAcquired: [String],
  recommendForPlacement: {
    type: Boolean,
    default: false,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Feedback', feedbackSchema);