const express = require('express');
const router = express.Router();
const { register, loginWithPassword ,verifyEmailOtp,sendLoginOtp,verifyLoginOtp,sendLoginOtpMobile,verifyLoginOtpMobile} = require('../controller/auth.controller');

router.post('/register', register);
router.post('/verify-email-otp', verifyEmailOtp);

router.post('/login-password', loginWithPassword);
router.post('/login-otp/send', sendLoginOtp);
router.post('/login-otp/verify', verifyLoginOtp);
router.post('/send-otp', sendLoginOtpMobile);
router.post('/verify-otp', verifyLoginOtpMobile);



module.exports = router;
