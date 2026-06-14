// backend/utils/validators.js

const validateFullName = (name) => {
  return /^[A-Z][a-zA-Z ]*$/.test(name);
};

const validateStudentId = (id) => {
  return /^\d{6}$/.test(id);
};

const validatePassword = (password) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(
    password
  );
};

const validatePlacementEmail = (email) => {
  return email.toLowerCase().endsWith('@mgmplacement.org');
};

const validateMentorEmail = (email) => {
  return email.toLowerCase().endsWith('@mentor.org');
};

const validateEmployerEmail = (email) => {
  return email.toLowerCase().endsWith('@employer.org');
};

module.exports = {
  validateFullName,
  validateStudentId,
  validatePassword,
  validatePlacementEmail,
  validateMentorEmail,
  validateEmployerEmail,
};