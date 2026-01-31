

const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const admin = require('../middlewares/admin.middleware');

const {
  addToCart,
  getCart,
  updateQuantity,
  removeItem,
  clearCart
} = require('../controller/cart.controller');

router.post("/add",auth, addToCart);
router.get("/:userId", auth, getCart);
router.put("/update-quantity", auth, updateQuantity);
router.post("/remove-item",auth, removeItem);
router.post("/clear",auth,clearCart);

module.exports = router;
