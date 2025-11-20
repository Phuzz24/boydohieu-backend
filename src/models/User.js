// src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true }, // Optional, unique nếu có
  fullName: { type: String }, // Tên đầy đủ
  gender: { type: String, enum: ['male', 'female', 'other'] }, // Giới tính
  phone: { type: String }, // SĐT
  address: { type: String }, // Địa chỉ
  dateOfBirth: { type: Date }, // Ngày sinh
  password: { type: String, required: true },
  avatar: { type: String, default: 'https://tse3.mm.bing.net/th/id/OIP.ujXKE1mONB_xfL7vwJUR3QHaHa?r=0&cb=thfvnext&rs=1&pid=ImgDetMain&o=7&rm=3' },
  role: { type: String, default: 'user' },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: [] }],
  status : { type: String, default: 'active', enum: ['active', 'blocked']},
  cart: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 },
    price: { type: Number },
    discountPrice: { type: Number },
    selectedSize: { type: String },
    selectedColor: { type: String },
    images: [{ type: String }],
    name: { type: String },
    brand: { type: String },
  }],
  resetToken: String,
  resetTokenExpiration: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Pre-save hook cho password và updatedAt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;