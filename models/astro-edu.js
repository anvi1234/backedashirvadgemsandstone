// models/AstroEducation.js
const mongoose = require('mongoose');

const AstroEducationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  course: String, // basic astrology, advanced, vastu etc.
  experienceLevel: String, // beginner / intermediate
  message: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AstroEducation', AstroEducationSchema);
