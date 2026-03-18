const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

let mongoServer;

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;
    
    // Try to connect to the MONGODB_URI first
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (err) {
      console.log(`⚠️ Primary MongoDB connection failed, falling back to In-Memory DB.`);
    }

    // Fallback to in-memory db
    mongoServer = await MongoMemoryServer.create();
    uri = mongoServer.getUri();
    
    const conn = await mongoose.connect(uri);
    console.log(`✅ In-Memory MongoDB Connected: ${conn.connection.host}`);
    
    // Check if we need to seed the database
    const User = require('../models/User');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
       console.log('🌱 Seeding database automatically since it is empty...');
       try {
           require('child_process').execSync('node seed/seedData.js', { 
               env: { ...process.env, MONGODB_URI: uri },
               stdio: 'inherit'
           });
           console.log('✅ Database seeded!');
       } catch (seedErr) {
           console.error('❌ Failed to seed database automatically:', seedErr.message);
       }
    }
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
