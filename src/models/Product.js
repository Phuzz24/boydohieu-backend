const mongoose = require('mongoose');

     const reviewSchema = new mongoose.Schema({
       user: { type: String, required: true },
       avatar: { type: String, default: '' },
       rating: { type: Number, required: true, min: 1, max: 5 },
       comment: { type: String, required: true },
       time: { type: Date, default: Date.now },
     });

     const productSchema = new mongoose.Schema({
       name: { type: String, required: true },
       brand: { type: String, required: true },
       images: [{ type: String }],
       price: { type: Number, required: true },
       discountPrice: { type: Number },
       description: { type: String, required: true },
       category: { type: String, required: true },
       isNew: { type: Boolean, default: false },
       sizes: [{ type: String }],
       colors: [{ type: String }],
       stock: { type: Number, required: true, min: 0 },
       reviews: [reviewSchema],
     }, { timestamps: true, suppressReservedKeysWarning: true });

     module.exports = mongoose.model('Product', productSchema);