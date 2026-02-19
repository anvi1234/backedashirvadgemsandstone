const Review = require('../models/review');
const Product = require('../models/product');
const User = require('../models/user');

/**
 * ADD REVIEW (USER)
 */


exports.addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    // Prevent duplicate review
    const exists = await Review.findOne({
      productId,
      userId: req.user.id
    });

    if (exists)
      return res.status(400).json({ message: 'You already reviewed this product' });
    const images = req.files
  ? req.files.map(file => ({
      url: file.path,
      public_id: file.filename
    }))
  : [];


    const review = await Review.create({
      productId,
      userId: req.user.id,
      rating,
      images,
      comment
    });

    // Update product average rating
    const user = await User.findById(req.user.id);
    const reviews = await Review.find({ productId });
    const avg =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      ratingAverage: avg.toFixed(1),
      ratingCount:reviews.length,
         $push: {
         reviews: {
          userId: req.user.id,
          userName: user.name,
          rating,
          comment,
          reviewimages: images
        }
      }

    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET REVIEWS BY PRODUCT
 */
exports.getReviewsByProduct = async (req, res) => {
  const reviews = await Review.find({ productId: req.params.productId })
    .populate('userId', 'name');

  res.json(reviews);
};
