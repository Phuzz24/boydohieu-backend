const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { addReview, updateReview, deleteReview, getReviews } = require('../controllers/reviewController');

router.get('/:productId', getReviews);
router.post('/', protect, addReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;