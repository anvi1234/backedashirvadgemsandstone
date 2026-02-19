const mongoose = require('mongoose');


const ReviewSchema = new mongoose.Schema({
  userName: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: String,
  comment:String,
  reviewimages: [
    {
      url: String,
      public_id: String
    }
  ],
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const SectionSchema = new mongoose.Schema({
  key: String,            // e.g. "benefits", "how-to-wear", "style-tip"
  title: String,          // displayed title
  content: String,        // HTML or markdown string (store sanitized HTML or markdown)
  collapsed: { type: Boolean, default: true }
});
const VariantSchema = new mongoose.Schema({
  attribute: {
    type: String,
    enum: ['Size', 'Weight', 'Type'],
    required: true
  },
  value: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  discountPercent: {
    type: Number,
    default: 0
  },
  finalPrice: {
    type: Number
  },
  sku: String,
  inStock: {
    type: Boolean,
    default: true
  }
});

const FeatureSchema = new mongoose.Schema({
  label: String,
  variants: [VariantSchema]

});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subtitle: String,
  slug: { type: String, index: true, unique: true },
  price: { type: Number, required: true },
  mrp: Number,
  currency: { type: String, default: 'INR' },
   category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  discount: Number,
  finalPrice:Number,
 // 👇 SINGLE IMAGE (Main thumbnail)
  mainImage: {
    url: String,
    public_id: String
  },

  // 👇 MULTIPLE IMAGES (Gallery)
  images: [
    {
      url: String,
      public_id: String
    }
  ], // max 6   
  //           // array of image URLs
  isActive: { type: Boolean, default: true },
  shortDescription: String,       // plain text or small HTML
  sections: [SectionSchema],      // multiple collapsible description blocks
  features: [FeatureSchema],             // list of bullet points or small features
  reviews: [ReviewSchema],
  ratingAverage: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
  extraBadges: [String],          // e.g. ["Blessed by Lord Murugan"]
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  meta: mongoose.Schema.Types.Mixed // for arbitrary extra data (offers, delivery info)
});
ProductSchema.pre('save', function () {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Product', ProductSchema);
