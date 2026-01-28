/**
 * Format date to readable string
 */
export const formatDate = (date, includeTime = false) => {
  if (!date) return 'N/A';
  
  const d = new Date(date);
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return d.toLocaleDateString('en-US', options);
};

/**
 * Format currency
 */
export const formatCurrency = (amount, currency = '₹') => {
  if (!amount) return `${currency}0`;
  return `${currency}${amount.toLocaleString('en-IN')}`;
};

/**
 * Get status color
 */
export const getStatusColor = (status) => {
  const colors = {
    applied: 'bg-blue-100 text-blue-700 border-blue-200',
    mentor_pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    mentor_approved: 'bg-green-100 text-green-700 border-green-200',
    mentor_rejected: 'bg-red-100 text-red-700 border-red-200',
    shortlisted: 'bg-purple-100 text-purple-700 border-purple-200',
    interview_scheduled: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    selected: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    rejected: 'bg-gray-100 text-gray-700 border-gray-200',
    completed: 'bg-teal-100 text-teal-700 border-teal-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
};

/**
 * Format status text
 */
export const formatStatus = (status) => {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Calculate employability score
 */
export const calculateEmployabilityScore = (profile) => {
  let score = 0;
  
  // Resume uploaded (20 points)
  if (profile.resumeUrl) score += 20;
  
  // Cover letter (10 points)
  if (profile.coverLetter && profile.coverLetter.length > 50) score += 10;
  
  // Skills (15 points)
  if (profile.skills && profile.skills.length >= 5) {
    score += 15;
  } else if (profile.skills && profile.skills.length > 0) {
    score += (profile.skills.length * 3);
  }
  
  // Certifications (15 points)
  if (profile.certifications && profile.certifications.length >= 2) {
    score += 15;
  } else if (profile.certifications && profile.certifications.length > 0) {
    score += (profile.certifications.length * 7);
  }
  
  // CGPA (40 points)
  if (profile.cgpa) {
    const cgpa = parseFloat(profile.cgpa);
    if (cgpa >= 9.0) score += 40;
    else if (cgpa >= 8.0) score += 35;
    else if (cgpa >= 7.5) score += 30;
    else if (cgpa >= 7.0) score += 25;
    else if (cgpa >= 6.5) score += 20;
    else score += 10;
  }
  
  return Math.min(score, 100); // Cap at 100
};

/**
 * Validate email
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validate phone
 */
export const isValidPhone = (phone) => {
  const regex = /^[0-9]{10}$/;
  return regex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get time ago
 */
export const getTimeAgo = (date) => {
  if (!date) return 'N/A';
  
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  
  return 'Just now';
};

/**
 * Generate random color
 */
export const getRandomColor = () => {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Download file
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Copy to clipboard
 */
export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  return true;
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};