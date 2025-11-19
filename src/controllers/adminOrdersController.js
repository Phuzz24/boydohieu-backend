// src/controllers/adminOrdersController.js
const Order = require('../models/Order');
const User = require('../models/User');

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

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('userId', 'fullName email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getOrders,
  updateOrderStatus,
};