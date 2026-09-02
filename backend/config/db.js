const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/royal_biriyani';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    isConnected = false;
    console.warn(`⚠️  MongoDB Connection Warning: ${error.message}`);
    console.warn('📌 Note: Make sure MongoDB is running locally (mongod) or provide a valid MONGODB_URI in backend/.env (e.g. MongoDB Atlas connection string).');
  }
};

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.log('ℹ️  MongoDB disconnected.');
});

mongoose.connection.on('reconnected', () => {
  isConnected = true;
  console.log('✅ MongoDB reconnected.');
});

module.exports = { connectDB, isConnected: () => isConnected };
