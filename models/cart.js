const mongoose = require("mongoose");
  
const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      price: Number,
      updatedprice:Number,
      image: String,
      feature:String,
      variantType:String,
      variantSize: String,
      quantity: { type: Number, default: 1 }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Cart", CartSchema);
