const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');  //This instantly upgrades your backend to production-level security. 
const rateLimit = require('express-rate-limit'); //Limits how many requests a user can send.
const connectDB = require('./config/db');

// Load env vars
dotenv.config(); //// Load environment variables from .env file
                 //Keeps secrets (DB URI, JWT secret) out of codebase

const app = express();


app.use(express.json());  // this both lines 15 and 16 Converts incoming JSON / form data into req.body
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({   // Line 19-23 Only allows your frontend to access backend
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true, // credentials: true allows cookies / auth headers
}));

// Security headers
app.use(helmet()); //  Adds multiple security protections automatically

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/student', require('./routes/student'));
app.use('/api/internship', require('./routes/internship'));
app.use('/api/application', require('./routes/application'));
app.use('/api/analytics', require('./routes/analytics'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 5000;

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`✅ Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();