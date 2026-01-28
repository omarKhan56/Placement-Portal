const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

console.log('\n🔍 VERIFYING ALL CONFIGURATIONS...\n');
console.log('='.repeat(60));

// Colors for terminal output
const colors = {
  success: '\x1b[32m',
  error: '\x1b[31m',
  warning: '\x1b[33m',
  info: '\x1b[36m',
  reset: '\x1b[0m'
};

// Test results
let testResults = {
  passed: 0,
  failed: 0,
  warnings: 0
};

// Helper functions
const logSuccess = (msg) => {
  console.log(`${colors.success}✅ ${msg}${colors.reset}`);
  testResults.passed++;
};

const logError = (msg) => {
  console.log(`${colors.error}❌ ${msg}${colors.reset}`);
  testResults.failed++;
};

const logWarning = (msg) => {
  console.log(`${colors.warning}⚠️  ${msg}${colors.reset}`);
  testResults.warnings++;
};

const logInfo = (msg) => {
  console.log(`${colors.info}ℹ️  ${msg}${colors.reset}`);
};

// TEST 1: Basic Environment Variables
console.log('\n📋 TEST 1: Environment Variables');
console.log('-'.repeat(60));

if (process.env.PORT) {
  logSuccess(`PORT configured: ${process.env.PORT}`);
} else {
  logError('PORT not configured');
}

if (process.env.NODE_ENV) {
  logSuccess(`NODE_ENV: ${process.env.NODE_ENV}`);
} else {
  logWarning('NODE_ENV not set (defaulting to development)');
}

if (process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 32) {
  logSuccess(`JWT_SECRET configured (${process.env.JWT_SECRET.length} chars)`);
} else if (process.env.JWT_SECRET) {
  logWarning(`JWT_SECRET too short (${process.env.JWT_SECRET.length} chars, recommended: 32+)`);
} else {
  logError('JWT_SECRET not configured');
}

if (process.env.FRONTEND_URL) {
  logSuccess(`FRONTEND_URL: ${process.env.FRONTEND_URL}`);
} else {
  logWarning('FRONTEND_URL not configured');
}

// TEST 2: MongoDB Connection
console.log('\n📊 TEST 2: MongoDB Connection');
console.log('-'.repeat(60));

async function testMongoDB() {
  if (!process.env.MONGODB_URI) {
    logError('MONGODB_URI not configured');
    return;
  }

  logInfo('Connecting to MongoDB...');
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    
    logSuccess('MongoDB connected successfully!');
    logInfo(`Database: ${mongoose.connection.name}`);
    logInfo(`Host: ${mongoose.connection.host}`);
    
    // Test a simple query
    const collections = await mongoose.connection.db.listCollections().toArray();
    logInfo(`Found ${collections.length} collections`);
    
    await mongoose.disconnect();
    logSuccess('MongoDB disconnected gracefully');
    
  } catch (error) {
    logError(`MongoDB connection failed: ${error.message}`);
    if (error.message.includes('authentication failed')) {
      logInfo('Check your username and password in MongoDB Atlas');
    }
    if (error.message.includes('network')) {
      logInfo('Check your IP whitelist in MongoDB Atlas (should be 0.0.0.0/0 for development)');
    }
  }
}

// TEST 3: Cloudinary Configuration
console.log('\n☁️  TEST 3: Cloudinary Configuration');
console.log('-'.repeat(60));

function testCloudinary() {
  if (!process.env.CLOUDINARY_CLOUD_NAME || 
      !process.env.CLOUDINARY_API_KEY || 
      !process.env.CLOUDINARY_API_SECRET) {
    logError('Cloudinary credentials incomplete');
    logInfo('Required: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
    return;
  }

  logSuccess('Cloudinary credentials found');
  logInfo(`Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  logInfo(`API Key: ${process.env.CLOUDINARY_API_KEY}`);
  
  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  logInfo('Testing Cloudinary API...');
  
  // Test API by fetching account details
  cloudinary.api.ping((error, result) => {
    if (error) {
      logError(`Cloudinary API test failed: ${error.message}`);
      logInfo('Double-check your API credentials in Cloudinary dashboard');
    } else {
      logSuccess('Cloudinary API working! ✨');
      logInfo('You can upload files now');
    }
  });
}

// TEST 4: Email Configuration (Brevo)
console.log('\n📧 TEST 4: Email Service (Brevo)');
console.log('-'.repeat(60));

async function testEmail() {
  if (!process.env.EMAIL_HOST || 
      !process.env.EMAIL_PORT || 
      !process.env.EMAIL_USER || 
      !process.env.EMAIL_PASS) {
    logError('Email credentials incomplete');
    logInfo('Required: EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS');
    return;
  }

  logSuccess('Email credentials found');
  logInfo(`Host: ${process.env.EMAIL_HOST}`);
  logInfo(`Port: ${process.env.EMAIL_PORT}`);
  logInfo(`User: ${process.env.EMAIL_USER}`);

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  logInfo('Verifying email connection...');

  try {
    await transporter.verify();
    logSuccess('Email server connection successful! 📬');
    
    // Ask if user wants to send test email
    logInfo('Email service is ready to send messages');
    logInfo('\nTo send a test email, run: node test-email.js');
    
  } catch (error) {
    logError(`Email verification failed: ${error.message}`);
    
    if (error.message.includes('Invalid login')) {
      logInfo('Check your SMTP credentials in Brevo dashboard');
      logInfo('Make sure you\'re using the SMTP key, not your account password');
    }
    if (error.message.includes('ECONNREFUSED')) {
      logInfo('Cannot connect to SMTP server');
      logInfo('Verify EMAIL_HOST and EMAIL_PORT are correct');
    }
  }
}

// TEST 5: Critical Security Checks
console.log('\n🔒 TEST 5: Security Checks');
console.log('-'.repeat(60));

if (process.env.JWT_SECRET === 'your_super_secret_jwt_key_min_32_characters_long_12345') {
  logWarning('Using example JWT_SECRET - Change this in production!');
} else {
  logSuccess('JWT_SECRET appears to be customized');
}

if (process.env.NODE_ENV === 'production' && process.env.FRONTEND_URL.includes('localhost')) {
  logWarning('Production mode but FRONTEND_URL is localhost');
}

if (process.env.MONGODB_URI && process.env.MONGODB_URI.includes('password')) {
  logWarning('MongoDB URI might contain plaintext password');
}

// RUN ALL TESTS
async function runAllTests() {
  await testMongoDB();
  testCloudinary();
  await testEmail();
  
  // Final Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 VERIFICATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`${colors.success}✅ Passed: ${testResults.passed}${colors.reset}`);
  console.log(`${colors.error}❌ Failed: ${testResults.failed}${colors.reset}`);
  console.log(`${colors.warning}⚠️  Warnings: ${testResults.warnings}${colors.reset}`);
  
  if (testResults.failed === 0) {
    console.log(`\n${colors.success}🎉 ALL CRITICAL TESTS PASSED!${colors.reset}`);
    console.log('Your backend is ready to run! 🚀');
  } else {
    console.log(`\n${colors.error}⚠️  Please fix the failed tests above${colors.reset}`);
  }
  
  console.log('\n');
  process.exit(testResults.failed > 0 ? 1 : 0);
}

// Start verification
runAllTests();