// src/controllers/adminUsersController.js
const User = require('../models/User');
const Order = require('../models/Order');

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password -resetToken -resetTokenExpiration')
      .sort({ createdAt: -1 });

    const usersWithOrders = await Promise.all(users.map(async (user) => {
      const orderCount = await Order.countDocuments({ userId: user._id });
      return {
        ...user._doc,
        orders: orderCount,
        status: user.status || 'active'
      };
    }));

    res.json({ users: usersWithOrders });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update user (block/unblock)
const updateUser = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ message: 'Không thể block admin' }); // Prevent block admin
    const updated = await User.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .select('-password -resetToken -resetTokenExpiration');
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  updateUser,
};