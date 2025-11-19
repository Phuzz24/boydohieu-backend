const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const orderController = require('../controllers/orderController');
const Order = require('../models/Order');
const { io } = require('../app');

// Existing routes
router.post('/', protect, orderController.createOrder);
router.get('/user', protect, orderController.getUserOrders);
router.get('/:id', protect, orderController.getOrderById);

// Cancel order (chỉ pending)
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
    if (!order) {
      return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
    }
    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Không thể hủy đơn hàng này (chỉ hủy khi chờ xử lý)' });
    }
    order.status = 'cancelled';
    await order.save();

    // FIX: Try-catch emit để không crash nếu io/room fail
    try {
      if (io) {
        io.to('admin').emit('orderCancelled', { orderId: order._id, reason: 'User cancelled' });
        console.log('Socket emit orderCancelled success');
      } else {
        console.warn('Socket io not available');
      }
    } catch (socketError) {
      console.error('Socket emit error (non-fatal):', socketError);
    }

    res.json({ message: 'Hủy đơn hàng thành công', order });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;