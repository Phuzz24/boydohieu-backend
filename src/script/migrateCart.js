// script/migrateCart.js
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const migrate = async () => {
  await connectDB();
  try {
    await User.updateMany(
      { cart: { $exists: false } },
      { $set: { cart: [] } }
    );
    console.log('Migration completed: Added cart field to all users');
    mongoose.connection.close();
  } catch (error) {
    console.error('Migration error:', error);
    mongoose.connection.close();
  }
};

migrate();