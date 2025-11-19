// src/script/setPlainPassword.js
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const setPlainPassword = async () => {
  try {
    await connectDB();
    const admin = await User.findOne({ username: 'admin' });
    if (!admin) {
      console.log('❌ Không tìm thấy admin!');
      return;
    }

    // Set PLAIN PASSWORD để pre-hook tự hash
    admin.password = 'admin123'; // Plain text
    await admin.save(); // Pre-hook sẽ hash tự động

    // Verify hash sau save
    const savedHash = admin.password;
    console.log('✅ Set plain password và hash mới:', savedHash.substring(0, 20) + '...');

    // Test match ngay (sau save)
    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare('admin123', savedHash);
    console.log('Match test sau save:', isMatch); // Phải true

    if (isMatch) {
      console.log('✅ Fix thành công! Giờ login sẽ OK.');
    } else {
      console.log('❌ Vẫn fail – Check bcrypt version.');
    }
  } catch (error) {
    console.error('Set password error:', error);
  } finally {
    mongoose.connection.close();
  }
};

setPlainPassword();