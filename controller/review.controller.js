const Review = require('../models/review');
const Product = require('../models/product');

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

    const review = await Review.create({
      productId,
      userId: req.user.id,
      rating,
      comment
    });

    // Update product average rating
    const reviews = await Review.find({ productId });
    const avg =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      ratings: avg.toFixed(1)
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
