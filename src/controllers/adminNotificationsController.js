const Notification = require('../models/Notification');

// HTTP handler: Send notification (route POST)
const sendNotification = async (req, res) => {
  try {
    const { title, message, type, relatedId, userId } = req.body;
    const notification = new Notification({ 
      title, message, type, relatedId, userId 
    });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Internal function: Create notification (non-HTTP, dùng từ controllers)
const createNotification = async ({ title, message, type, relatedId, userId = null }) => {
  try {
    const notification = new Notification({ 
      title, message, type, relatedId, userId 
    });
    await notification.save();
    console.log('Notification created:', { title, type });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Get notifications
const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, read = 'all' } = req.query;
    const query = { userId: null };
    if (read !== 'all') query.read = read === 'unread' ? false : true;

    const notifications = await Notification.find(query)
      .populate('relatedId', 'total status _id')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const unreadCount = await Notification.countDocuments({ userId: null, read: false });
    res.json({ notifications, unreadCount, pages: Math.ceil(unreadCount / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark read
const markRead = async (req, res) => {
  try {
    const { id } = req.params;
    if (id === 'all') {
      await Notification.updateMany({ userId: null, read: false }, { read: true });
      return res.json({ message: 'All marked as read' });
    }
    const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
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