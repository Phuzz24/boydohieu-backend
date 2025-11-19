// server/resetAdminPassword.js
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const resetPassword = async () => {
  try {
    await connectDB();
    const admin = await User.findOne({ username: 'admin' });
    if (!admin) {
      console.log('❌ Không tìm thấy admin!');
      return;
    }
    const newHashed = await bcrypt.hash('admin123', 12);
    admin.password = newHashed;
    await admin.save();
    console.log('✅ Reset password thành công! Hash mới:', newHashed.substring(0, 20) + '...');
  } catch (error) {
    console.error('Reset error:', error);
  } finally {
    mongoose.connection.close();
  }
};

resetPassword();