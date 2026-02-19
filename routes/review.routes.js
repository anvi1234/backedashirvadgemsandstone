const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const { uploadReviewImage } = require("../middlewares/upload.middleware");
const {
  addReview,
  getReviewsByProduct
} = require('../controller/review.controller');

router.post('/', auth,uploadReviewImage, addReview);
router.get('/:productId', getReviewsByProduct);

module.exports = router;
