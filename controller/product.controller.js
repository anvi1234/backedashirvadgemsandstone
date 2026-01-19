const Product = require('../models/product');
const slugify = require('slugify');
const cloudinary = require('../config/cloudinary');

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      subtitle,
      shortDescription,
      price,
      discount = 0,
      category,
      stock = 1,
      isActive = true,
      ratings = 0
    } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({
        message: "Required fields missing"
      });
    }

    /* =====================
       Parse JSON Fields
    ====================== */
    const features = req.body.features
      ? JSON.parse(req.body.features)
      : [];

    const sections = req.body.sections
      ? JSON.parse(req.body.sections)
      : [];

    /* =====================
       Main Image
    ====================== */
    const mainImageFile = req.files?.mainImage?.[0];

    if (!mainImageFile) {
      return res.status(400).json({
        message: "Main image is required"
      });
    }

    const mainImage = {
      url: mainImageFile.path,
      public_id: mainImageFile.filename
    };

    /* =====================
       Gallery Images
    ====================== */
    const images = req.files?.images
      ? req.files.images.map(file => ({
          url: file.path,
          public_id: file.filename
        }))
      : [];

    if (images.length > 6) {
      return res.status(400).json({
        message: "Maximum 6 gallery images allowed"
      });
    }

    /* =====================
       Price Calculation
    ====================== */
    const finalPrice = price - (price * discount) / 100;

    /* =====================
       Create Product
    ====================== */
    const product = await Product.create({
      name,
      subtitle,
      shortDescription,
      slug: slugify(name, { lower: true, strict: true }),

      price,
      discount,
      finalPrice,

      category,
      stock,
      isActive,
      ratings,

      mainImage,
      images,

      features,
      sections
    });

    res.status(201).json({
      success: true,
      product
    });

  } catch (error) {
    console.error("Create product error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.getProducts = async (req, res) => {
  const products = await Product.find({ isActive: true })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 });

  res.json(products);
};

/**
 * GET PRODUCT BY SLUG
 */
exports.getProductBySlug = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate('category');

  if (!product)
    return res.status(404).json({ message: 'Product not found' });

  res.json(product);
};

exports.getProductsByCategorySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const products = await Product.find({ isActive: true })
      .populate({
        path: 'category',
        match: { slug },   // 👈 filter by category slug
        select: 'name slug'
      });

    // ❗ Remove products where category didn't match
    const filteredProducts = products.filter(
      product => product.category !== null
    );

    if (!filteredProducts.length) {
      return res.status(404).json({ message: 'No products found' });
    }

    res.status(200).json(filteredProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductsByMultipleCategorySlug = async (req, res) => {
  try {
    let { slug } = req.params;

    // 👉 convert "rudraksh,gems" → ["rudraksh", "gems"]
    const slugs = slug.split(',').map(s => s.trim());

    const products = await Product.find({ isActive: true })
      .populate({
        path: 'category',
        match: { slug: { $in: slugs } }, // ✅ MULTIPLE SLUG SUPPORT
        select: 'name slug'
      });

    // remove non-matching categories
    const filteredProducts = products.filter(
      product => product.category !== null
    );

    if (!filteredProducts.length) {
      return res.status(404).json({ message: 'No products found' });
    }

    res.status(200).json(filteredProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * UPDATE PRODUCT (ADMIN)
 */
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    /* =====================
       BASIC FIELDS
    ====================== */
    const fields = [
      'name',
      'subtitle',
      'shortDescription',
      'price',
      'discount',
      'category',
      'stock',
      'isActive',
      'ratings'
    ];

    fields.forEach(field => {
      console.log("req.body[field",req.body[field])
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    if (req.body.name) {
      product.slug = slugify(req.body.name, { lower: true, strict: true });
    }

    /* =====================
       PRICE CALCULATION
    ====================== */
    if (req.body.price || req.body.discount) {
      product.finalPrice =
        product.price - (product.price * product.discount) / 100;
    }

    /* =====================
       UPDATE MAIN IMAGE
    ====================== */
    if (req.files?.mainImage?.[0]) {
      // Remove old image from cloudinary
      if (product.mainImage?.public_id) {
        await cloudinary.uploader.destroy(product.mainImage.public_id);
      }

      product.mainImage = {
        url: req.files.mainImage[0].path,
        public_id: req.files.mainImage[0].filename
      };
    }

    /* =====================
       ADD NEW GALLERY IMAGES
    ====================== */
    if (req.files?.images) {
      const newImages = req.files.images.map(file => ({
        url: file.path,
        public_id: file.filename
      }));

      product.images.push(...newImages);

      if (product.images.length > 6) {
        return res.status(400).json({
          message: 'Maximum 6 gallery images allowed'
        });
      }
    }

    /* =====================
       REMOVE GALLERY IMAGES
       (send array of public_ids)
    ====================== */
    if (req.body.removeImages) {
      const removeImages = JSON.parse(req.body.removeImages);

      for (const img of removeImages) {
        await cloudinary.uploader.destroy(img.public_id);
      }

      product.images = product.images.filter(
        img => !removeImages.some(r => r.public_id === img.public_id)
      );
    }

    /* =====================
       FEATURES & SECTIONS
    ====================== */
    const parseIfString = (value) => {
  if (!value) return value;
  if (typeof value === 'string') return JSON.parse(value);
  return value;
};

if (req.body.features) {
  product.features = parseIfString(req.body.features);
}

if (req.body.sections) {
  product.sections = parseIfString(req.body.sections);
}
    await product.save();

    res.json({ success: true, product });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * TOGGLE PRODUCT STATUS (ADMIN)
 */
exports.toggleProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  product.isActive = !product.isActive;
  await product.save();

  res.json(product);
};


/**
 * GET PRODUCT BY ID
 */
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
   

    const product = await Product.findById(id)
      .populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      success: true,
      product
    });

  } catch (error) {
    console.error("Get product by ID error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    /* =====================
       DELETE IMAGES
    ====================== */
    if (product.mainImage?.public_id) {
      await cloudinary.uploader.destroy(product.mainImage.public_id);
    }

    for (const img of product.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.removeProductImage = async (req, res) => {
  const { productId, public_id } = req.body;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  await cloudinary.uploader.destroy(public_id);

  product.images = product.images.filter(
    img => img.public_id !== public_id
  );

  await product.save();

  res.json({ success: true, images: product.images });
};
