// server/seedAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    await connectDB(); // Connect MongoDB

    // Check nếu admin đã tồn tại
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin user đã tồn tại! Username: admin, Password: admin123');
      process.exit(0);
    }

    // Tạo user admin mới
    const hashedPassword = await bcrypt.hash('admin123', 12); // Password: admin123
    const adminUser = new User({
      username: 'admin',
      email: 'admin@shop.com',
      fullName: 'Admin User',
      password: hashedPassword,
      role: 'admin', // Quan trọng: Set role admin
      avatar: 'https://example.com/admin-avatar.jpg', // Optional
    });

    await adminUser.save();
    console.log('✅ Tạo admin user thành công!');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Email: admin@shop.com');
    console.log('Role: admin');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi tạo admin user:', error.message);
    process.exit(1);
  }
};

seedAdmin();