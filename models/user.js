const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    required: true
  },
  phone: String,
  password: String,
  isEmailVerified: {
    type: Boolean,
    default: false
  },

  emailOtp: String,
  emailOtpExpires: Date,

  loginOtp: String,
  loginOtpExpires: Date,

  role: {
    type: String,
    default: 'user'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
