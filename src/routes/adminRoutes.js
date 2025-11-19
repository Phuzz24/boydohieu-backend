const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Import từ controllers tách
const adminProductsController = require('../controllers/adminProductsController');
const adminOrdersController = require('../controllers/adminOrdersController');
const adminUsersController = require('../controllers/adminUsersController');
const adminStatsController = require('../controllers/adminStatsController');
const adminNotificationsController = require('../controllers/adminNotificationsController');

// Middleware for all admin routes
router.use(protect);
router.use(adminOnly);

// Stats
router.get('/stats', adminStatsController.getDashboardStats);

// Products
router.get('/products', adminProductsController.getProducts);
router.post('/products', adminProductsController.createProduct);
router.put('/products/:id', adminProductsController.updateProduct);
router.delete('/products/:id', adminProductsController.deleteProduct);

// Orders
router.get('/orders', adminOrdersController.getOrders);
router.put('/orders/:id', adminOrdersController.updateOrderStatus);

// Users
router.get('/users', adminUsersController.getUsers);
router.put('/users/:id', adminUsersController.updateUser);

//Notifications
router.get('/notifications', adminNotificationsController.getNotifications);
router.put('/notifications/:id/read', adminNotificationsController.markRead);
router.post('/notifications', adminNotificationsController.sendNotification);


module.exports = router;