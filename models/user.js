const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true
  },
  phone: {
   type: String,
    required: true,
      unique: true    
  },
  password: String,
  isPhoneVerified: {
    type: Boolean,
    default: false
  },

isEmailVerified:{
   type: Boolean,
    default: false,
},
  phoneOtp: String,
  phoneOtpExpires: Date,

  loginOtp: String,
  loginOtpExpires: Date,

  role: {
    type: String,
    default: 'user'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
