// src/controllers/adminOrdersController.js
const Order = require('../models/Order');
const User = require('../models/User');
const { io } = require('../app');  // FIX: Import io để emit socket nếu cần
const { getIO } = require('../utils/socket'); // ← ĐÚNG ĐƯỜNG DẪN
const { createNotification } = require('./notificationController'); // nếu có

// Get all orders
const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;

    const orders = await Order.find(query)
      .populate('userId', 'fullName email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const formattedOrders = orders.map(order => ({
      ...order._doc,
      customerName: order.userId?.fullName || 'Unknown',
      items: order.products.length
    }));

    const total = await Order.countDocuments(query);
    res.json({ orders: formattedOrders, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// server/controllers/adminOrdersController.js
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    const validStatuses = ['pending', 'shipping', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate('userId', 'fullName');

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    // DÙNG getIO() – LUÔN LUÔN ĐÚNG, KHÔNG BAO GIỜ UNDEFINED!
    const io = getIO();

    const statusMessage = {
      shipping: 'Đơn hàng của bạn đang được giao',
      completed: 'Đơn hàng đã giao thành công!',
      cancelled: 'Đơn hàng đã bị hủy',
      pending: 'Đơn hàng đang được xử lý lại'
    };

    // Gửi cho user
    if (order.userId?._id) {
      io.to(`user_${order.userId._id}`).emit('orderStatusUpdate', {
        orderId: order._id,
        orderCode: order.orderCode || order._id.slice(-6),
        status: order.status,
        message: statusMessage[status] || 'Trạng thái đơn hàng đã được cập nhật',
        updatedAt: new Date()
      });

      // Gửi notification DB
      try {
        await createNotification?.({
          userId: order.userId._id,
          title: 'Cập nhật đơn hàng',
          message: `${statusMessage[status] || 'Trạng thái đã thay đổi'} #${order.orderCode || order._id.slice(-6)}`,
          type: 'order',
          relatedId: order._id
        });
      } catch (e) {
        console.log('Notification chưa có hoặc lỗi:', e.message);
      }
    }

    // Gửi cho tất cả admin
    io.to('admin').emit('orderUpdated', {
      orderId: order._id,
      status: order.status
    });

    res.json({
      message: 'Cập nhật trạng thái thành công',
      order
    });

  } catch (error) {
    console.error('Error updateOrderStatus:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = {
  getOrders,
  updateOrderStatus,
};