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
  try {
    console.log("REGISTER API HIT");

    const { name, email, password, phone } = req.body;
    console.log("INPUT:", { name, email, phone });

    const cleanPhone = phone.replace('+91', '');
    console.log("CLEAN PHONE:", cleanPhone);

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

    let hashedPassword = '';
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("OTP:", otp);

    const user = await User.create({
      name,
      email,
      phone: cleanPhone,
      password: hashedPassword ?? '',
      phoneOtp: otp,
      phoneOtpExpires: Date.now() + 10 * 60 * 1000
    });

    console.log("USER CREATED:", user._id);

    // ✅ IMPORTANT: await WhatsApp API
    const result = await sendWhatsAppOtp(cleanPhone, otp);

    console.log("WHATSAPP REGISTER RESPONSE:", result);

    res.status(201).json({
      message: 'OTP sent to WhatsApp'
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error.response?.data || error.message);

    res.status(500).json({
      message: error.response?.data?.message || error.message
    });
  }
};

/**
 * VERIFY EMAIL OTP
 */
exports.verifyPhoneOtp = async (req, res) => {
  const { phone, otp } = req.body;

  const user = await User.findOne({ phone });
  if (!user) return res.status(400).json({ message: 'User not found' });

  if (
    user.phoneOtp !== otp ||
   user.phoneOtpExpires < Date.now()
  ) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  user.isPhoneVerified = true;
  user.phoneOtp = null;
  user.phoneOtp = null;
  await user.save();

  res.json({ message: 'Phone Number verified successfully' });
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
exports.resendPhoneOtp = async (req, res) => {
  try {
    console.log("RESEND OTP API HIT");

    const { phone } = req.body;
    console.log("PHONE:", phone);

    const user = await User.findOne({ phone });
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    if (user.isPhoneVerified)
      return res.status(400).json({ message: 'Phone Number already verified' });

    const phoneOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("NEW OTP:", phoneOtp);

    user.phoneOtp = phoneOtp;
    user.phoneOtpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // ✅ IMPORTANT: await this
    const result = await sendWhatsAppOtp(phone, phoneOtp);

    console.log("WHATSAPP RESEND RESPONSE:", result);

    res.json({ message: 'OTP resent successfully' });

  } catch (error) {
    console.error("RESEND OTP ERROR:", error.response?.data || error.message);

    res.status(500).json({
      message: error.response?.data?.message || error.message
    });
  }
};
exports.sendLoginOtpMobile = async (req, res) => {
  try {
    console.log("API HIT");

    const { phone } = req.body;
    console.log("PHONE:", phone);

    if (!phone)
      return res.status(400).json({ message: 'Phone number is required' });

    const cleanPhone = phone.replace('+91', '');
    console.log("CLEAN PHONE:", cleanPhone);

    const user = await User.findOne({ phone: cleanPhone });

    if (!user)
      return res.status(400).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("OTP:", otp);

    user.loginOtp = otp;
    user.loginOtpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // ✅ IMPORTANT: await this
    const result = await sendWhatsAppOtp(cleanPhone, otp);

    console.log("WHATSAPP RESPONSE:", result);

    res.json({ message: 'OTP sent to WhatsApp' });

  } catch (error) {
    console.error("ERROR:", error.response?.data || error.message);
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