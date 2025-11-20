const express = require('express');
const router = express.Router();
const { getNotifications, markRead } = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');

// GET /api/notifications/user - Lấy list notifications của user (paginated, unread count)
router.get('/user', protect, getNotifications);

// PUT /api/notifications/:id/read - Mark 1 notification read
router.put('/:id/read', protect, markRead);

// PUT /api/notifications/clear - Mark all unread as read
router.put('/clear', protect, markRead);

module.exports = router;