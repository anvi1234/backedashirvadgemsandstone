const User = require('../models/user');
const Order = require('../models/order');

/**
 * GET ALL USERS
 */
exports.getUsers = async (req, res) => {
  const users = await User.find({ role: 'user' }).select('-password');
  res.json(users);
};

/**
 * GET DASHBOARD STATS
 */
exports.getDashboardStats = async (req, res) => {
  const users = await User.countDocuments({ role: 'user' });
  const orders = await Order.countDocuments();
  const revenue = await Order.aggregate([
    { $match: { paymentStatus: 'PAID' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);

  res.json({
    users,
    orders,
    revenue: revenue[0]?.total || 0
  });
};
