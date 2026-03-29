const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOtpEmail } = require('../config/send-email');
const sendToken = require('../config/sendToken');
const sendWhatsAppOtp = require('../utils/sendWhatsappOtp');
/**
 * REGISTER WITH EMAIL OTP
 */
exports.register = async (req, res) => {
  const { name, email, password, phone } = req.body;
  const cleanPhone = phone.replace('+91', '');
  const existing = await User.findOne({
    $or: [{ email }, { phone: cleanPhone }]
  });

  if (existing) {
    if (existing.email === email) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    if (existing.phone === cleanPhone) {
      return res.status(400).json({ message: 'Phone number already exists' });
    }
  }
  let hashedPassword = ''
if(password){
   hashedPassword = await bcrypt.hash(password, 10);
}

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await User.create({
    name,
    email,
    phone: cleanPhone, // ✅ always save clean phone
    password: hashedPassword ?? '',
    emailOtp: otp,
    emailOtpExpires: Date.now() + 10 * 60 * 1000
  });

  await sendOtpEmail(email, otp, 'Email Verification');

  res.status(201).json({
    message: 'OTP sent to email'
  });
};

/**
 * VERIFY EMAIL OTP
 */
exports.verifyEmailOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'User not found' });

  if (
    user.emailOtp !== otp ||
    user.emailOtpExpires < Date.now()
  ) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  user.isEmailVerified = true;
  user.emailOtp = null;
  user.emailOtpExpires = null;
  await user.save();

  res.json({ message: 'Email verified successfully' });
};


exports.loginWithPassword = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  if (!user.isEmailVerified)
    return res.status(400).json({ message: 'Email not verified' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({ message: 'Invalid credentials' });

  sendToken(res, user);
};

/**
 * LOGIN
 */
exports.sendLoginOtp = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'User not found' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.loginOtp = otp;
  user.loginOtpExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  await sendOtpEmail(email, otp, 'Login');

  res.json({ message: 'Login OTP sent' });
};

exports.verifyLoginOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'User not found' });

  if (
    user.loginOtp !== otp ||
    user.loginOtpExpires < Date.now()
  ) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  user.loginOtp = null;
  user.loginOtpExpires = null;
  await user.save();

  sendToken(res, user);
};


/**
 * RESEND EMAIL OTP
 */
exports.resendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    if (user.isEmailVerified)
      return res.status(400).json({ message: 'Email already verified' });

    const emailOtp = Math.floor(100000 + Math.random() * 900000).toString();

    user.emailOtp = emailOtp;
    user.emailOtpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    await sendOtpEmail(email, emailOtp);

    res.json({ message: 'OTP resent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.sendLoginOtpMobile = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone)
      return res.status(400).json({ message: 'Phone number is required' });

    const cleanPhone = phone.replace('+91', '');

    const user = await User.findOne({ phone: cleanPhone });

    if (!user)
      return res.status(400).json({ message: 'User not found' });

    // ✅ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ Save OTP
    user.loginOtp = otp;
    user.loginOtpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    // ✅ Send WhatsApp OTP
    await sendWhatsAppOtp(cleanPhone, otp);

    res.json({ message: 'OTP sent to WhatsApp' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.verifyLoginOtpMobile = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const cleanPhone = phone.replace('+91', '');

    const user = await User.findOne({ phone: cleanPhone });

    if (!user)
      return res.status(400).json({ message: 'User not found' });

    if (
      user.loginOtp !== otp ||
      user.loginOtpExpires < Date.now()
    ) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // ✅ Clear OTP
    user.loginOtp = null;
    user.loginOtpExpires = null;
    await user.save();

    // ✅ Login user (JWT)
    sendToken(res, user);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};