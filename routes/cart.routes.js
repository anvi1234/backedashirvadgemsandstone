

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

router.post("/add", addToCart);
router.get("/:userId", getCart);
router.put("/update-quantity", updateQuantity);
router.post("/remove-item", removeItem);
router.post("/clear",clearCart);

module.exports = router;
