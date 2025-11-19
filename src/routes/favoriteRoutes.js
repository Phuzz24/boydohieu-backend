// src/routes/favoriteRoutes.js
const express = require('express');
const router = express.Router();
const { getFavorites, addFavorite, removeFavorite } = require('../controllers/favoriteController');
const { protect } = require('../middlewares/authMiddleware'); // Destructuring protect (function)

// Routes (protected bằng protect)
router.get('/', protect, getFavorites); // SỬA: authMiddleware → protect
router.post('/', protect, addFavorite); // SỬA
router.delete('/:productId', protect, removeFavorite); // SỬA

module.exports = router;