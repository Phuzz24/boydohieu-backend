// src/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const Joi = require('joi');

// Đăng ký (thêm optional fields)
const register = async (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
    fullName: Joi.string().optional(),
    gender: Joi.string().valid('male', 'female', 'other').optional(),
    phone: Joi.string().optional(),
    address: Joi.string().optional(),
    dateOfBirth: Joi.date().optional(),
    email: Joi.string().email().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { username, password, fullName, gender, phone, address, dateOfBirth, email } = req.body;
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ message: 'Tài khoản đã tồn tại' });

    // Kiểm tra email unique nếu cung cấp
    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    user = new User({ 
      username, 
      password, 
      fullName, 
      gender, 
      phone, 
      address, 
      dateOfBirth, 
      email,
      cart: [] 
    }); // Khởi tạo cart rỗng
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
   // Trong register function (sau user.save())
    res.status(201).json({
    token,
    user: { 
      _id: user._id, 
      username: user.username, 
      avatar: user.avatar, 
      cart: user.cart || [],
      fullName: user.fullName,
      gender: user.gender,
      phone: user.phone,
      address: user.address,
      dateOfBirth: user.dateOfBirth,
      email: user.email,
      role: user.role,  // THÊM: Include role
    },
    message: 'Đăng ký thành công',
  });
  } catch (err) {
    next(err);
  }
};

// Đăng nhập (giữ nguyên, nhưng trả về thêm fields mới)
const login = async (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { username, password } = req.body;
    console.log('[DEBUG LOGIN] Input - Username:', username, 'Password length:', password.length);

    const user = await User.findOne({ username });
    console.log('[DEBUG LOGIN] User query result:', user ? { id: user._id, username: user.username, role: user.role } : 'NULL');

    if (!user || !(await user.matchPassword(password))) {
      console.log('[DEBUG LOGIN] Auth fail - User exists?', !!user, 'Password match?', user ? await user.matchPassword(password) : false);
      return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không đúng' });
    }

    // Trong login, sau findOne
  if (user.status === 'blocked') {
    return res.status(403).json({ message: 'Tài khoản bị block' });
  }

    console.log('[DEBUG LOGIN] Auth success - Role:', user.role);

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    // Trong login function (sau verify password)
    res.json({
      token,
      user: { 
        _id: user._id, 
        username: user.username, 
        avatar: user.avatar, 
        cart: user.cart || [],
        fullName: user.fullName,
        gender: user.gender,
        phone: user.phone,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        email: user.email,
        role: user.role,  // THÊM: Include role
      },
      message: 'Đăng nhập thành công',
    });
  } catch (err) {
    next(err);
  }
};

// Cập nhật profile (mới)
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    const { username, fullName, gender, phone, address, dateOfBirth, email } = req.body;

    // Validate unique cho username và email nếu thay đổi
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) return res.status(400).json({ message: 'Tên người dùng đã tồn tại!' });
      user.username = username;
    }
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) return res.status(400).json({ message: 'Email đã tồn tại!' });
      user.email = email;
    }

    // Cập nhật các trường khác
    user.fullName = fullName || user.fullName;
    user.gender = gender || user.gender;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : user.dateOfBirth;

    // Xử lý upload avatar
    if (req.file) {
      // Xóa avatar cũ nếu tồn tại và không phải default
      if (user.avatar && user.avatar !== 'https://tse3.mm.bing.net/th/id/OIP.ujXKE1mONB_xfL7vwJUR3QHaHa?r=0&cb=thfvnext&rs=1&pid=ImgDetMain&o=7&rm=3') {
        const oldAvatarPath = path.join(__dirname, '..', 'public', user.avatar.replace('/uploads/avatars/', ''));
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      }
      // Lưu path mới (relatively từ public)
      user.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    await user.save();
    res.json({
      message: 'Cập nhật hồ sơ thành công!',
      user: {
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        gender: user.gender,
        phone: user.phone,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        email: user.email,
        avatar: user.avatar,
        cart: user.cart || [],
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    if (error.message.includes('Chỉ hỗ trợ file ảnh!')) {
      return res.status(400).json({ message: 'Chỉ hỗ trợ file ảnh!' });
    }
    res.status(500).json({ message: 'Lỗi cập nhật hồ sơ!', error: error.message });
  }
};

// Quên mật khẩu (giữ nguyên)
const forgotPassword = async (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'Tài khoản không tồn tại' });

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // Hết hạn sau 1 giờ
    await user.save();

    // Vì chưa triển khai email, trả về resetToken để client xử lý (có thể hiển thị hoặc log)
    res.json({
      message: 'Token đặt lại mật khẩu đã được tạo (chưa gửi email)',
      resetToken,
      resetUrl: `http://localhost:5173/reset/${resetToken}`,
    });
  } catch (err) {
    next(err);
  }
};

// Reset mật khẩu (giữ nguyên)
const resetPassword = async (req, res, next) => {
  const schema = Joi.object({
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });

    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.json({ message: 'Đặt lại mật khẩu thành công' });
  } catch (err) {
    next(err);
  }
};

// Đổi mật khẩu (giữ nguyên)
// ĐỔI MẬT KHẨU – PHIÊN BẢN CHUẨN NHẤT (KHÔNG HASH TAY!!!)
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Kiểm tra mật khẩu cũ (dùng method của model → đúng)
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng!' });
    }

    // QUAN TRỌNG NHẤT: GÁN PLAINTEXT → ĐỂ pre('save') TỰ HASH!!!
    user.password = newPassword;  // ← CHỈ GÁN THÔI, KHÔNG HASH TAY!!!
    
    await user.save(); // ← pre('save') sẽ tự động hash ngon lành!

    res.json({ 
      message: 'Đổi mật khẩu thành công! Vui lòng đăng nhập lại.' 
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Export object để destructuring hoạt động
module.exports = {
  register,
  login,
  updateProfile,
  forgotPassword,
  resetPassword,
  changePassword,
};