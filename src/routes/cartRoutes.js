// src/routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware'); // Destructuring protect (function)
const { syncCart } = require('../controllers/cartController');

// Routes (protected bằng protect)
router.post('/sync', protect, syncCart); // SỬA: authMiddleware → protect

// Optional: Thêm routes khác nếu cần (e.g., get cart)
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('cart');
    res.json({ cart: user.cart || [] });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy giỏ hàng' });
  }
});

module.exports = router;