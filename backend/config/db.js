const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Mongoose 6+ doesn't need these options
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✅ Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;