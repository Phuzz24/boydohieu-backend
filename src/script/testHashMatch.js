// server/testHashMatch.js
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const testHashMatch = async () => {
  try {
    await connectDB();
    const admin = await User.findOne({ username: 'admin' }).select('password');
    if (!admin) {
      console.log('❌ Không tìm thấy admin!');
      return;
    }

    const fullHash = admin.password;
    console.log('Full hash from DB:', fullHash);

    const plainPassword = 'admin123';
    const isMatch = await bcrypt.compare(plainPassword, fullHash);
    console.log('Bcrypt compare result:', isMatch); // Phải true nếu hash đúng

    if (!isMatch) {
      console.log('❌ Hash không match! Cần reset.');
      // Force reset hash mới
      const newHash = await bcrypt.hash(plainPassword, 12);
      admin.password = newHash;
      await admin.save();
      console.log('✅ Force reset hash mới:', newHash.substring(0, 20) + '...');
      const newMatch = await bcrypt.compare(plainPassword, newHash);
      console.log('New match test:', newMatch); // Phải true
    } else {
      console.log('✅ Hash match đúng!');
    }
  } catch (error) {
    console.error('Test error:', error);
  } finally {
    mongoose.connection.close();
  }
};

testHashMatch();