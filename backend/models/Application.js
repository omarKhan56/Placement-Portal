const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: [
      'applied',
      'mentor_pending',
      'mentor_approved',
      'mentor_rejected',
      'shortlisted',
      'interview_scheduled',
      'selected',
      'rejected',
      'completed'
    ],
    default: 'applied',
  },
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  mentorApprovalDate: Date,
  mentorComments: String,
  interviewDate: Date,
  interviewMode: {
    type: String,
    enum: ['online', 'offline'],
  },
  interviewLink: String,
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  }],
});

module.exports = mongoose.model('Application', applicationSchema);