const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const admin = require('../middlewares/admin.middleware');

const {
  createRazorpayOrder,
  verifyPayment,
  getUserOrders,
  getAllOrders,
  createCODOrder
} = require('../controller/order.controller');
// router.post('/create-payment',auth, createRazorpayOrder);
router.post('/create-payment', auth,createRazorpayOrder);
router.post('/verify-payment',auth, verifyPayment);
router.get('/my-orders', auth, getUserOrders);
router.get('/admin/orders', auth, admin, getAllOrders);
router.post('/create-cod-order', auth, createCODOrder);

module.exports = router;
