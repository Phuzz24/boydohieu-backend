const mongoose = require('mongoose');
require('dotenv').config(); // Load .env ngay đầu

const connectDB = async () => {
  try {
    // Validate MONGO_URI
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
      throw new Error('MONGO_URI không được định nghĩa trong .env! Vui lòng kiểm tra file .env.');
    }

    console.log('Đang kết nối MongoDB với URI (ẩn sensitive):', MONGO_URI.replace(/\/\/[^@]*@/, '//***@')); // Log an toàn

    // Connect (không cần options deprecated)
    await mongoose.connect(MONGO_URI);

    console.log('Kết nối MongoDB thành công!');
    console.log('DB name:', mongoose.connection.name); // Verify DB
  } catch (err) {
    console.error('MongoDB connection error:', {
      message: err.message,
      code: err.code,
      stack: err.stack,
    });
    process.exit(1);
  }
};

module.exports = connectDB;