const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderCode: { type: String, unique: true, default: function() { return 'ORD' + Date.now().toString().slice(-6); } }, // FIX: Short code ORD + 6 digits timestamp
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      name: { type: String },
      brand: { type: String },
      selectedSize: String,
      selectedColor: String,
      images: [{ type: String }], // FIX: Thêm array images snapshot
    },
  ],
  total: { type: Number, required: true },
  address: {
    province: { type: String, required: true },
    district: { type: String, required: true },
  },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  fullName: { type: String, required: true },
  paymentMethod: { type: String, default: 'cod' },
  status: { type: String, enum: ['pending', 'shipping', 'completed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);