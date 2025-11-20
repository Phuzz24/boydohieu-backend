// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { login, register, forgotPassword, resetPassword, changePassword, updateProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware'); // Chỉ dùng cho protected routes
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Cấu hình multer cho upload avatar (giữ nguyên)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'public/uploads/avatars/';
    const fs = require('fs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ hỗ trợ file ảnh!'), false);
    }
  }
});

// Routes PUBLIC (không cần token)
router.post('/login', login); // PUBLIC: Không protect
router.post('/register', register); // PUBLIC
router.post('/request-password-reset', forgotPassword); // PUBLIC
router.post('/reset-password/:token', resetPassword); // PUBLIC

// Routes PROTECTED (cần token)
router.post('/change-password', protect, changePassword);
router.put('/profile', protect, upload.single('avatar'), updateProfile);

router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -resetToken -resetTokenExpiration');
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    // FIX: Trả full user object (không subset - include createdAt, phone, gender, address, dateOfBirth, etc.)
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

module.exports = router;