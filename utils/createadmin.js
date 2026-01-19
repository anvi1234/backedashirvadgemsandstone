require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');

mongoose.connect(process.env.MONGO_URI);

async function createAdmin() {
  const adminExists = await User.findOne({ role: 'admin' });
  if (adminExists) {
    console.log('Admin already exists');
    process.exit();
  }

  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  await User.create({
    name: 'Admin',
    email: 'admin@spiritualstore.com',
    password: hashedPassword,
    role: 'admin'
  });

  console.log('Admin created successfully');
  process.exit();
}

createAdmin();
