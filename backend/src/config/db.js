// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const dbURI = process.env.MONGO_URI;
    
    // Connect to the database
    const conn = await mongoose.connect(dbURI);
    
    console.log(`☁️ MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database connection error: ${error.message}`);
    process.exit(1); // Stop the server completely if connection fails
  }
};

// Export the function so server.js can use it
module.exports = connectDB;
