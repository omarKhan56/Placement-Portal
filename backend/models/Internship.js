//backend/models/Internship.js

const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requiredSkills: [String],
  eligibleDepartments: [String],
  duration: {
    type: Number, // in months
    required: true,
  },
  stipend: {
    min: Number,
    max: Number,
  },
  location: {
    type: String,
    required: true,
  },
  mode: {
    type: String,
    enum: ['online', 'offline', 'hybrid'],
    default: 'offline',
  },
  placementConversionProbability: {
    type: Number,
    min: 0,
    max: 100,
  },
  totalSeats: {
    type: Number,
    required: true,
  },
  seatsRemaining: {
    type: Number,
    required: true,
  },
  startDate: Date,
  applicationDeadline: Date,
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Internship', internshipSchema);