require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');



async function createAdmin() {
  try {
   await mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  family: 4
});
    console.log("MongoDB Connected");

    const adminExists = await User.findOne({ email: 'admin@spiritualstore.com' });

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

  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

createAdmin();
