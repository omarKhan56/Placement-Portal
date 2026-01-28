const nodemailer = require('nodemailer');

// Create transporter only if email credentials are provided
let transporter = null;

if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  console.log('✅ Email service configured');
} else {
  console.log('⚠️ Email credentials not configured - emails will not be sent');
}

const sendEmail = async (options) => {
  if (!transporter) {
    console.log('⚠️ Email not sent - transporter not configured');
    return; // Don't fail if email is not configured
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${options.to}`);
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    // Don't throw error - just log it
  }
};

module.exports = sendEmail;