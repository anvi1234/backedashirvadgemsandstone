const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

/* Cloudinary Config */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/* Storage with 600x600 transform */
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "products",
    format: "webp",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      {
        width: 600,
        height: 600,
        crop: "fill",
        quality: "auto"
      }
    ]
  })
});

/* Multer instance */
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image")) {
      cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  }
});

/* Review Image Storage */

const reviewStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "reviews", // ⭐ separate folder
    format: "webp",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      {
        width: 600,
        height: 600,
        crop: "fill",
        quality: "auto"
      }
    ]
  })
});

const uploadReviewImage = multer({
  storage: reviewStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image")) {
      return cb(new Error("Only image files allowed"), false);
    }
    cb(null, true);
  }
}).array("images", 5); // ⭐ multiple files



/* Upload Fields Middleware */
const uploadProductImages = upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "images", maxCount: 6 }
]);

module.exports = {
  uploadProductImages,
  uploadReviewImage
};
