require("dotenv").config();
const mongoose = require("mongoose");

const Product = require("../models/product");
const {
  generateSlug,
  generateSEO,
  generateOpenGraph
} = require("../utils/seoGenerator");

/* =====================
   CONNECT DATABASE
===================== */

async function connectDB() {
  try {

    await mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  family: 4
});

    console.log("MongoDB Connected");

    updateProductsSEO();

  } catch (error) {

    console.error("MongoDB connection error:", error);
    process.exit(1);

  }
}

/* =====================
   UPDATE PRODUCTS
===================== */

async function updateProductsSEO() {
  try {

    const products = await Product.find();

    console.log(`Found ${products.length} products`);

    for (const product of products) {

      product.slug = generateSlug(product.name);

      product.seo = generateSEO(product);

      product.openGraph = generateOpenGraph(product);

      product.updatedAt = new Date();

      await product.save();

      console.log(`Updated: ${product.name}`);
    }

    console.log("All products updated successfully");

    process.exit();

  } catch (error) {

    console.error("Error updating products:", error);
    process.exit(1);

  }
}

/* =====================
   RUN SCRIPT
===================== */

connectDB();