const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Import từ controllers tách
const adminProductsController = require('../controllers/adminProductsController');
const { updateOrderStatus, getOrders } = require('../controllers/adminOrdersController');
const adminOrdersController = require('../controllers/adminOrdersController');
const adminUsersController = require('../controllers/adminUsersController');
const adminStatsController = require('../controllers/adminStatsController');
const adminNotificationsController = require('../controllers/adminNotificationsController');

router.use(protect, adminOnly);

// Stats
router.get('/stats', adminStatsController.getDashboardStats);

// Products
router.get('/products', adminProductsController.getProducts);
router.post('/products', adminProductsController.createProduct);
router.put('/products/:id', adminProductsController.updateProduct);
router.delete('/products/:id', adminProductsController.deleteProduct);

// Orders
router.put('/orders/:id', updateOrderStatus);
router.get('/orders', getOrders);

// Users
router.get('/users', adminUsersController.getUsers);
router.put('/users/:id', adminUsersController.updateUser);

//Notifications
router.get('/notifications', adminNotificationsController.getNotifications);
router.put('/notifications/:id/read', adminNotificationsController.markRead);
router.put('/notifications/all/read', adminNotificationsController.markRead);
router.post('/notifications', adminNotificationsController.sendNotification);



module.exports = router;