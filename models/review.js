const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
   images: [
    {
      url: String,
      public_id: String
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
