// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  console.log('protect middleware called, headers:', req.headers);
  
  // Fix: Dùng req.headers.authorization (lowercase)
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  
  if (!token) {
    console.error('No token provided');
    return res.status(401).json({ message: 'Không có token, truy cập bị từ chối' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded:', decoded);
    
    // Set req.user = decoded (đảm bảo token chứa role khi generate)
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error verifying token:', error.message);
    res.status(401).json({ message: 'Token không hợp lệ, vui lòng đăng nhập lại' });
  }
};

const adminOnly = (req, res, next) => {
  console.log('adminOnly middleware called, user role:', req.user?.role);
  
  if (req.user && req.user.role === 'admin') {
    next(); // OK, tiếp tục
  } else {
    console.error('Access denied: Not admin');
    res.status(403).json({ message: 'Chỉ admin mới có quyền truy cập' });
  }
};

module.exports = { protect, adminOnly };