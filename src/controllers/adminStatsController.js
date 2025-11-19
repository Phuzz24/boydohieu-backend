// src/controllers/adminStatsController.js
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// Dashboard stats (local const)
const getDashboardStats = async (req, res) => {
  try {
    // Revenue: Sum total của orders completed
    const completedOrders = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
    ]);
    const revenue = completedOrders[0]?.totalRevenue || 0;

    // Orders count
    const ordersCount = await Order.countDocuments();

    // Products count
    const productsCount = await Product.countDocuments();

    // Customers count (users trừ admin)
    const customersCount = await User.countDocuments({ role: { $ne: 'admin' } });

    // Mock change % (có thể tính real từ DB nếu cần)
    res.json({
      revenue: { value: revenue.toLocaleString() + 'đ', change: '+12.5%' },
      orders: { value: ordersCount.toString(), change: '+8.2%' },
      products: { value: productsCount.toString(), change: '+3.1%' },
      customers: { value: customersCount.toString(), change: '+15.3%' },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export object để destructuring hoạt động
module.exports = {
  getDashboardStats,
};