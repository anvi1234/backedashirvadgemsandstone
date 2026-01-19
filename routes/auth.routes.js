const express = require('express');
const router = express.Router();
const { register, loginWithPassword ,verifyEmailOtp,sendLoginOtp,verifyLoginOtp} = require('../controller/auth.controller');

router.post('/register', register);
router.post('/verify-email-otp', verifyEmailOtp);

router.post('/login-password', loginWithPassword);
router.post('/login-otp/send', sendLoginOtp);
router.post('/login-otp/verify', verifyLoginOtp);


module.exports = router;
