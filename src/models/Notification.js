// src/models/Notification.js (tạo mới)
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['order', 'stock', 'user', 'system'], required: true },
  read: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // null = all admin
  relatedId: { type: mongoose.Schema.Types.ObjectId }, // e.g., order ID
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);