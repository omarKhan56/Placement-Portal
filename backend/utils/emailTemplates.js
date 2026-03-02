//backend/utils/emailTemplates.js

exports.applicationSubmittedTemplate = (studentName, internshipTitle) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Application Submitted Successfully</h2>
      <p>Dear ${studentName},</p>
      <p>Your application for <strong>${internshipTitle}</strong> has been submitted successfully.</p>
      <p>You will receive updates on your application status via email.</p>
      <br>
      <p>Best regards,</p>
      <p>Placement Cell</p>
    </div>
  `;
};

exports.mentorApprovalRequestTemplate = (mentorName, studentName, internshipTitle) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Approval Request</h2>
      <p>Dear ${mentorName},</p>
      <p><strong>${studentName}</strong> has applied for <strong>${internshipTitle}</strong> and requires your approval.</p>
      <p>Please log in to the portal to review and approve/reject this application.</p>
      <br>
      <p>Best regards,</p>
      <p>Placement Portal</p>
    </div>
  `;
};

exports.applicationStatusUpdateTemplate = (studentName, internshipTitle, status) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Application Status Update</h2>
      <p>Dear ${studentName},</p>
      <p>Your application for <strong>${internshipTitle}</strong> has been updated.</p>
      <p><strong>New Status:</strong> ${status}</p>
      <br>
      <p>Best regards,</p>
      <p>Placement Cell</p>
    </div>
  `;
};

exports.interviewScheduledTemplate = (studentName, internshipTitle, interviewDate, interviewLink) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Interview Scheduled</h2>
      <p>Dear ${studentName},</p>
      <p>Your interview for <strong>${internshipTitle}</strong> has been scheduled.</p>
      <p><strong>Date & Time:</strong> ${interviewDate}</p>
      ${interviewLink ? `<p><strong>Interview Link:</strong> <a href="${interviewLink}">${interviewLink}</a></p>` : ''}
      <p>Please be prepared and join on time.</p>
      <br>
      <p>Best regards,</p>
      <p>Placement Cell</p>
    </div>
  `;
};