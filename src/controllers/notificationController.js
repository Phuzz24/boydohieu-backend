// src/controllers/notificationController.js (FIX: Import io from app)
const Notification = require('../models/Notification');
const { io } = require('../app');  // FIX: Import io để emit socket

// HTTP handler: Send notification (POST /api/notifications/send - admin only)
const sendNotification = async (req, res) => {
  try {
    const { title, message, type, relatedId, userId } = req.body;
    const notification = new Notification({ 
      title, message, type, relatedId, userId 
    });
    await notification.save();
    // Emit realtime nếu userId cụ thể
    if (userId && io) {
      io.to(`user_${userId}`).emit('newNotification', notification);
    }
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Internal function: Create notification (non-HTTP, dùng từ controllers như orderController)
const createNotification = async ({ title, message, type, relatedId, userId = null }) => {
  try {
    const notification = new Notification({ 
      title, message, type, relatedId, userId 
    });
    await notification.save();
    console.log('Notification created:', { title, type, userId });
    // Emit realtime nếu userId
    if (userId && io) {
      io.to(`user_${userId}`).emit('newNotification', notification);
    }
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Get notifications (GET /api/notifications/user - paginated, unread count for user)
const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, read = 'all' } = req.query;
    const query = { userId: req.user.id };  // Specific to logged user
    if (read !== 'all') query.read = read === 'unread' ? false : true;

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const unreadCount = await Notification.countDocuments({ userId: req.user.id, read: false });
    res.json({ notifications, unreadCount, pages: Math.ceil(unreadCount / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark read (PUT /api/notifications/:id/read or /clear)
const markRead = async (req, res) => {
  try {
    const { id } = req.params;
    if (id === 'clear') {
      // Mark all unread as read
      await Notification.updateMany({ userId: req.user.id, read: false }, { read: true });
      return res.json({ message: 'All marked as read' });
    }
    // Mark single
    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: req.user.id },  // Ensure belongs to user
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  sendNotification,
  createNotification, // Export internal function
  getNotifications,
  markRead,
};