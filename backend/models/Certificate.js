//backend/models/Application.js
const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
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
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
  },
  certificateNumber: {
    type: String,
    required: true,
    unique: true,
  },
  certificateUrl: String,
  issuedDate: {
    type: Date,
    default: Date.now,
  },
  verificationCode: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Certificate', certificateSchema);