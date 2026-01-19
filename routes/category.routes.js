const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const admin = require('../middlewares/admin.middleware');
const {
  createCategory,
  getCategories,
  toggleCategory,
  updateCategory,
  deleteCategory,
  getCategoryById
} = require('../controller/category.controller');

// router.post('/', auth, admin, createCategory);
router.post('/',  createCategory);
router.get('/', getCategories);
router.patch('/:id/toggle', auth, admin, toggleCategory);
router.get('/', getCategories);
router.get('/getCategoryByID/:id', getCategoryById);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory)

module.exports = router;
