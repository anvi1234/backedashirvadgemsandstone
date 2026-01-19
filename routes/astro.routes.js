// routes/astro.routes.js
const express = require('express');
const router = express.Router();

const {
  addConsultation,
  getConsultations,
  addEducation,
  getEducations
} = require('../controller/astro.controller');

router.post('/consultation', addConsultation);
router.get('/consultation', getConsultations);

router.post('/education', addEducation);
router.get('/education', getEducations);

module.exports = router;
