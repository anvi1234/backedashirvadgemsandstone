// models/AstroConsultation.js
const mongoose = require('mongoose');

const AstroConsultationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  birthDate: Date,
  birthTime: String,
  birthPlace: String,
  consultationType: String, // love, career, marriage etc.
  message: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AstroConsultation', AstroConsultationSchema);
