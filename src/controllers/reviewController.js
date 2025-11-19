// src/controllers/reviewController.js
const Review = require('../models/Review');
const User = require('../models/User');

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).populate('userId', 'username avatar');
    res.json(reviews);
  } catch (error) {
    console.error('Error in getReviews:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy bình luận', error: error.message });
  }
};

const addReview = async (req, res) => {
  try {
    const { productId, comment, rating } = req.body;
    if (!productId || !comment || !rating) {
      return res.status(400).json({ message: 'Thiếu thông tin cần thiết' });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }
    const review = new Review({
      productId,
      userId: req.user.id,
      username: user.username,
      avatar: user.avatar,
      rating,
      comment,
    });
    await review.save();
    res.json({ message: 'Đã thêm bình luận', review }); // Trả về review vừa tạo
  } catch (error) {
    console.error('Error in addReview:', error);
    res.status(500).json({ message: 'Lỗi server khi thêm bình luận', error: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const { comment, rating } = req.body;
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Bình luận không tồn tại' });
    }
    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Bạn không có quyền chỉnh sửa' });
    }
    review.comment = comment || review.comment;
    review.rating = rating || review.rating;
    review.time = new Date();
    await review.save();
    res.json({ message: 'Đã cập nhật bình luận', review });
  } catch (error) {
    console.error('Error in updateReview:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật bình luận', error: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Bình luận không tồn tại' });
    }
    if (review.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Bạn không có quyền xóa' });
    }
    await review.remove();
    res.json({ message: 'Đã xóa bình luận' });
  } catch (error) {
    console.error('Error in deleteReview:', error);
    res.status(500).json({ message: 'Lỗi server khi xóa bình luận', error: error.message });
  }
};

// Export object để destructuring hoạt động
module.exports = {
  getReviews,
  addReview,
  updateReview,
  deleteReview,
};