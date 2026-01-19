// controllers/astro.controller.js
const AstroConsultation = require('../models/astro-consultant');
const AstroEducation = require('../models/astro-edu');

// Consultation
exports.addConsultation = async (req, res) => {
  try {
    const data = await AstroConsultation.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getConsultations = async (req, res) => {
  const list = await AstroConsultation.find().sort({ createdAt: -1 });
  res.json(list);
};

// Education
exports.addEducation = async (req, res) => {
  try {
    const data = await AstroEducation.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getEducations = async (req, res) => {
  const list = await AstroEducation.find().sort({ createdAt: -1 });
  res.json(list);
};
