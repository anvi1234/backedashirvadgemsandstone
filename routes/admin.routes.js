const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const admin = require('../middlewares/admin.middleware');
const {
  getUsers,
  getDashboardStats
} = require('../controller/admin.controller');

router.get('/users', auth, admin, getUsers);
router.get('/dashboard', auth, admin, getDashboardStats);

module.exports = router;
