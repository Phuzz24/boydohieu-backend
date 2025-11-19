// src/controllers/cartController.js
const User = require('../models/User');
const Joi = require('joi'); // Nếu chưa có: npm i joi

exports.syncCart = async (req, res) => {
  // Validate body: cart là array objects
  const schema = Joi.object({
    cart: Joi.array().items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
        selectedSize: Joi.string().optional(),
        selectedColor: Joi.string().optional(),
        price: Joi.number().optional(),
        name: Joi.string().optional(),
        brand: Joi.string().optional(),
      })
    ).optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { cart } = req.body;
    const userId = req.user.id; // Từ protect middleware

    // Check user tồn tại
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Lưu cart vào MongoDB
    user.cart = cart || [];
    await user.save();

    res.json({ 
      message: 'Giỏ hàng đã được đồng bộ', 
      cart: user.cart 
    });
  } catch (error) {
    console.error('Error in syncCart:', error);
    res.status(500).json({ message: 'Lỗi khi đồng bộ giỏ hàng', error: error.message });
  }
};