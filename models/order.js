const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
 productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product",required:true },
      name: String,
      price: Number,
      updatedprice:Number,
      image: String,
      feature:String,
      variantType:String,
      variantSize: String,
      quantity: { type: Number, default: 1 }
});

const addressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String },
  pinCode: { type: String, required: true },
  state: { type: String },
  country: { type: String, default: 'India' },
  phone:{type:Number,required:true}
});

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    paymentId: { type: String },
    razorpayOrderId: { type: String },
    paymentStatus: { type: String, enum: ['PENDING', 'PAID', 'FAILED'], default: 'PENDING' },
    orderStatus: { type: String, enum: ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'], default: 'PLACED' },
    address: { type: addressSchema, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
 