// src/controllers/productController.js
const Product = require('../models/Product');

const getProducts = async (req, res, next) => {
  try {
    console.log('GET /api/products called');
    const products = await Product.find();
    console.log('Products found:', products);
    res.json(products);
  } catch (error) {
    console.error('Error in getProducts:', error);
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    console.log('GET /api/products/:id called', req.params.id);
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error in getProductById:', error);
    next(error);
  }
};

// Export object để destructuring hoạt động
module.exports = {
  getProducts,
  getProductById,
};