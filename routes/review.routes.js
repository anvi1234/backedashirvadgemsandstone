const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const {
  addReview,
  getReviewsByProduct
} = require('../controller/review.controller');

router.post('/', auth, addReview);
router.get('/:productId', getReviewsByProduct);

module.exports = router;
