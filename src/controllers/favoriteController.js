// src/controllers/favoriteController.js
const User = require('../models/User');

const addFavorite = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId || productId === 'undefined') {  // Thêm check
      return res.status(400).json({ message: 'ID sản phẩm không hợp lệ' });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    if (user.favorites.includes(productId)) {
      return res.status(400).json({ message: 'Sản phẩm đã có trong danh sách yêu thích' });
    }
    user.favorites.push(productId);
    await user.save();
    res.json({ message: 'Đã thêm vào yêu thích', favorites: user.favorites });
  } catch (error) {
    console.error('Lỗi khi thêm yêu thích:', error);
    res.status(500).json({ message: 'Lỗi server khi thêm yêu thích', error: error.message });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return res.status(400).json({ message: 'Thiếu ID sản phẩm' });
    }
    const user = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $pull: { favorites: productId } },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    res.json({ message: 'Đã xóa khỏi yêu thích', favorites: user.favorites });
  } catch (error) {
    console.error('Lỗi khi xóa yêu thích:', error);
    res.status(500).json({ message: 'Lỗi server khi xóa yêu thích', error: error.message });
  }
};

const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    const validFavorites = user.favorites.filter(fav => fav && fav._id);
    res.json(validFavorites);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách yêu thích:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Export object để destructuring hoạt động (fix lỗi import { getFavorites })
module.exports = {
  addFavorite,
  removeFavorite,
  getFavorites,
};