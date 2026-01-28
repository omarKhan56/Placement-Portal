const Application = require('../models/Application');
const Student = require('../models/Student');
const Internship = require('../models/Internship');
const User = require('../models/User');
const sendEmail = require('../config/nodemailer');
const {
  applicationSubmittedTemplate,
  applicationStatusUpdateTemplate,
  interviewScheduledTemplate,
} = require('../utils/emailTemplates');

/* ================================
   CREATE APPLICATION (APPLY FOR INTERNSHIP)
================================ */
exports.createApplication = async (req, res) => {
  try {
    const { internshipId } = req.body;

    const student = await Student.findOne({ userId: req.user.id });
    const internship = await Internship.findById(internshipId);

    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    if (internship.seatsRemaining <= 0) {
      return res.status(400).json({ message: 'No seats available' });
    }

    const existingApplication = await Application.findOne({
      studentId: student._id,
      internshipId,
    });

    if (existingApplication) {
      return res
        .status(400)
        .json({ message: 'Already applied to this internship' });
    }

    const application = await Application.create({
      studentId: student._id,
      internshipId,
      status: 'mentor_pending',
      statusHistory: [
        {
          status: 'applied',
          timestamp: new Date(),
        },
      ],
    });

    await sendEmail({
      to: req.user.email,
      subject: 'Application Submitted Successfully',
      html: applicationSubmittedTemplate(student.fullName, internship.title),
    });

    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   GET SINGLE APPLICATION BY ID
================================ */
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate({
        path: 'studentId',
        populate: {
          path: 'userId',
          select: 'email fullName',
        },
      })
      .populate('internshipId');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({
      success: true,
      data: application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   GET MY APPLICATIONS (STUDENT)
================================ */
exports.getMyApplications = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });

    const applications = await Application.find({
      studentId: student._id,
    })
      .populate('internshipId')
      .sort({ appliedAt: -1 });

    res.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   GET ALL APPLICATIONS
================================ */
exports.getAllApplications = async (req, res) => {
  try {
    const { status, internshipId } = req.query;

    let query = {};

    if (internshipId) query.internshipId = internshipId;

    if (req.user.role === 'mentor') {
      query.status = 'mentor_pending';
    } else if (status) {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate({
        path: 'studentId',
        populate: {
          path: 'userId',
          select: 'email',
        },
      })
      .populate('internshipId')
      .sort({ appliedAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error('Error in getAllApplications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/* ================================
   UPDATE APPLICATION STATUS
================================ */
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, interviewDate, interviewLink } = req.body;

    const application = await Application.findById(req.params.id)
      .populate('studentId')
      .populate('internshipId');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;

    application.statusHistory.push({
      status,
      timestamp: new Date(),
      updatedBy: req.user.id,
    });

    if (status === 'interview_scheduled') {
      application.interviewDate = interviewDate;
      application.interviewLink = interviewLink;

      const studentUser = await User.findById(application.studentId.userId);

      await sendEmail({
        to: studentUser.email,
        subject: 'Interview Scheduled',
        html: interviewScheduledTemplate(
          application.studentId.fullName,
          application.internshipId.title,
          interviewDate,
          interviewLink
        ),
      });
    }

    if (status === 'selected') {
      const internship = await Internship.findById(application.internshipId._id);
      internship.seatsRemaining = Math.max(0, internship.seatsRemaining - 1);
      await internship.save();
    }

    await application.save();

    const studentUser = await User.findById(application.studentId.userId);

    await sendEmail({
      to: studentUser.email,
      subject: 'Application Status Update',
      html: applicationStatusUpdateTemplate(
        application.studentId.fullName,
        application.internshipId.title,
        status
      ),
    });

    res.json({
      success: true,
      data: application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   MENTOR ACTION
================================ */
exports.mentorAction = async (req, res) => {
  try {
    const { action, comments } = req.body; // approve | reject

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Use "approve" or "reject"',
      });
    }

    const application = await Application.findById(req.params.id)
      .populate({
        path: 'studentId',
        populate: {
          path: 'userId',
          select: 'email',
        },
      })
      .populate('internshipId');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    application.status =
      action === 'approve' ? 'mentor_approved' : 'mentor_rejected';

    application.mentorComments = comments;
    application.mentorActionDate = Date.now();

    application.statusHistory.push({
      status: application.status,
      updatedBy: req.user._id,
      comment: comments,
      timestamp: new Date(),
    });

    await application.save();

    res.json({
      success: true,
      message: `Application ${action}d successfully`,
      data: application,
    });
  } catch (error) {
    console.error('Error in mentorAction:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/* ================================
   DELETE APPLICATION
================================ */
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    await application.deleteOne();

    res.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
