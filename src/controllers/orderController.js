const Order = require('../models/Order');
const mongoose = require('mongoose');
const { io } = require('../app');
const adminNotificationsController = require('./adminNotificationsController');
const { createNotification } = require('./notificationController');  // Import createNotification for user

const createOrder = async (req, res) => {
  try {
    const { products, total, address, phone, email, fullName } = req.body;
    console.log('Create order body:', { products: products.length, total, address });

    if (!products || !total || !address || !phone || !email || !fullName) {
      return res.status(400).json({ message: 'Thiếu thông tin cần thiết' });
    }
    if (!address.province || !address.district) {
      return res.status(400).json({ message: 'Thiếu thông tin tỉnh hoặc huyện' });
    }

    // FIX: Snapshot images (ảnh đầu) vào products
    const orderProducts = products.map(item => ({
      ...item,
      images: item.images && item.images.length > 0 ? [item.images[0]] : [], // Chỉ ảnh đầu
    }));

    const order = new Order({
      userId: new mongoose.Types.ObjectId(req.user.id),
      products: orderProducts,
      total: Number(total),
      address,
      phone,
      email,
      fullName,
      paymentMethod: 'cod',
      status: 'pending',
    });

    await order.save();
    console.log('Order created successfully:', { id: order._id, code: order.orderCode, userId: req.user.id });

    // Emit socket to admin
    try {
      if (io) {
        io.to('admin').emit('newOrder', {
          orderId: order._id,
          orderCode: order.orderCode, // Short code
          customer: fullName,
          total: total.toLocaleString() + 'đ',
          createdAt: new Date().toLocaleString('vi-VN')
        });
      }
    } catch (socketError) {
      console.error('Socket emit error:', socketError);
    }

    // Send admin notification
    await adminNotificationsController.createNotification({
      title: 'Đơn hàng mới',
      message: `Khách hàng ${fullName} đặt đơn hàng #${order.orderCode} trị giá ${total.toLocaleString()}₫`,
      type: 'order',
      relatedId: order._id
    });

    // NEW: Create user notification for order confirmation
    await createNotification({
      title: 'Đơn hàng mới được tạo',
      message: `Cảm ơn bạn! Đơn hàng #${order.orderCode} trị giá ${total.toLocaleString()}₫ đã được đặt thành công. Chúng tôi sẽ xử lý sớm.`,
      type: 'order',
      relatedId: order._id,
      userId: req.user.id  // Specific to this user
    });

    // NEW: Emit realtime to user's room
    if (io) {
      io.to(`user_${req.user.id}`).emit('newNotification', {
        _id: new mongoose.Types.ObjectId(),  // Fake ID for realtime
        title: 'Đơn hàng mới được tạo',
        message: `Đơn hàng #${order.orderCode} đã được đặt thành công.`,
        type: 'order',
        relatedId: order._id,
        read: false,
        createdAt: new Date()
      });
    }

    res.status(201).json({ message: 'Đặt hàng thành công', order });
  } catch (error) {
    console.error('Error in createOrder:', error);
    res.status(500).json({ message: 'Lỗi server khi tạo đơn hàng', error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('products.productId', 'name price images brand') // Fallback populate nếu snapshot empty
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error in getUserOrders:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy đơn hàng', error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user?.id;

    const order = await Order.findOne({
      _id: new mongoose.Types.ObjectId(orderId),
      userId: new mongoose.Types.ObjectId(userId),
    }).populate('products.productId', 'name price images brand');

    if (!order) {
      return res.status(404).json({ message: 'Đơn hàng không tồn tại hoặc không thuộc quyền của bạn' });
    }

    res.json(order);
  } catch (error) {
    console.error('[ERROR] getOrderById:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy chi tiết đơn hàng', error: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
};