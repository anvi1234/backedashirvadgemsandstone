const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const { uploadBannerImage } = require("../middlewares/upload.middleware");
const {
  createBanner,
  getBanners,
  deleteBanner

} = require('../controller/banner.controller');

router.post('/', auth,uploadBannerImage, createBanner);
router.get('/', getBanners);
router.delete('/:id', deleteBanner);

module.exports = router;
