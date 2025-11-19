// server/testUser.js (Test query user)
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const testAdmin = async () => {
  try {
    await connectDB();
    const admin = await User.findOne({ username: 'admin' }).select('username password role email fullName');
    console.log('Admin user:', admin);
    if (admin) {
      console.log('✅ User tồn tại. Role:', admin.role);
      console.log('Password hash (ẩn phần sau):', admin.password ? admin.password.substring(0, 20) + '...' : 'NULL');
    } else {
      console.log('❌ Không tìm thấy admin user!');
    }
  } catch (error) {
    console.error('Test error:', error);
  } finally {
    mongoose.connection.close();
  }
};

testAdmin();