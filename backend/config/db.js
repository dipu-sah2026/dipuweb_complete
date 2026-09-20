const mongoose = require('mongoose');
const dns = require('dns');

// Fix for Node.js Windows SRV DNS resolution ECONNREFUSED on MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // Ignore in environments where custom DNS is restricted
}

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/dipueditx';
    const conn = await mongoose.connect(connUri);
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
  }
};

module.exports = connectDB;
