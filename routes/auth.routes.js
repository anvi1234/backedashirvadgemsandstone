const express = require('express');
const router = express.Router();
const { register, loginWithPassword ,verifyPhoneOtp,sendLoginOtp,verifyLoginOtp,sendLoginOtpMobile,verifyLoginOtpMobile,resendPhoneOtp} = require('../controller/auth.controller');

router.post('/register', register);
router.post('/verify-phone-otp', verifyPhoneOtp);
router.post('/resend-phone-otp', resendPhoneOtp);
router.post('/login-password', loginWithPassword);
router.post('/login-otp/send', sendLoginOtp);
router.post('/login-otp/verify', verifyLoginOtp);
router.post('/send-otp', sendLoginOtpMobile);
router.post('/verify-otp', verifyLoginOtpMobile);



module.exports = router;
