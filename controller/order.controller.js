const Order = require('../models/order');
const razorpayInstance = require('../config/razorpay');
const crypto = require('crypto');

/**
 * CREATE RAZORPAY ORDER
 */
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpayInstance.orders.create(options);

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * VERIFY PAYMENT & SAVE ORDER
 */
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, items, totalAmount, address } = req.body;

    // 1️⃣ Validate Razorpay signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    if (expectedSign !== razorpay_signature)
      return res.status(400).json({ status: 'fail', message: 'Payment verification failed' });

    // 2️⃣ Save order
    const order = await Order.create({
      userId: req.user.id, // from auth middleware
      items: items.map(i => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        total: i.price * i.quantity
      })),
      totalAmount,
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      paymentStatus: 'PAID',
      address
    });

    res.status(201).json({ status: 'success', message: 'Order placed successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'fail', message: error.message });
  }
};

/**
 * USER ORDER HISTORY
 */
exports.getUserOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(orders);
};

/**
 * ADMIN – ALL ORDERS
 */
exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
};
