const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const admin = require('../middlewares/admin.middleware');
const { uploadProductImages } = require("../middlewares/upload.middleware");
const {
  createProduct,
  getProducts,
  getProductBySlug,
  updateProduct,
  toggleProduct,
  getProductById,
  deleteProduct,getProductsByCategorySlug,
  getProductsByMultipleCategorySlug

} = require('../controller/product.controller');

router.get('/', getProducts);
router.get('/getProduct/:slug', getProductsByCategorySlug);
router.post('/create-product', uploadProductImages, createProduct);
// router.post('/create-product', auth, admin, uploadProductImages, createProduct);
// router.put('/:id', auth, admin, updateProduct);
router.put('/updateProduct/:id', uploadProductImages,updateProduct);
router.patch('/:id/toggle', auth, admin, toggleProduct);
router.get('/getProductById/:id', getProductById);
router.delete('/delProductById/:id', deleteProduct);
router.get('/multiplecategory/:slug', getProductsByMultipleCategorySlug);





module.exports = router;


module.exports = router;
