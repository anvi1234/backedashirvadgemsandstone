const Cart = require("../models/cart");

/* ================= ADD TO CART ================= */
exports.addToCart = async (req, res) => {
  const { userId, product } = req.body;

  let cart = await Cart.findOne({ userId });
  if (!cart) cart = new Cart({ userId, items: [] });

  const index = cart.items.findIndex(
    i => i.productId.toString() === product.productId
  );

  if (index > -1) {
    cart.items[index].quantity += product.quantity;
      cart.items[index].updatedprice =
      cart.items[index].price * cart.items[index].quantity;
     
  } else {
    cart.items.push(product);
  }

  await cart.save();
  res.json(cart);
};

/* ================= GET CART ================= */
exports.getCart = async (req, res) => {
  const { userId } = req.params;
  const cart = await Cart.findOne({ userId });
  res.json(cart || { items: [] });
};

/* ================= UPDATE QUANTITY ================= */
exports.updateQuantity = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  const cart = await Cart.findOne({ userId });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const item = cart.items.find(
    i => i.productId.toString() === productId
  );

  if (!item) return res.status(404).json({ message: "Item not found" });

  item.quantity = quantity;
  item.updatedprice = item.price * quantity;
  await cart.save();

  res.json(cart);
};

/* ================= REMOVE SINGLE ITEM ================= */
exports.removeItem = async (req, res) => {
  const { userId, productId } = req.body;

  const cart = await Cart.findOne({ userId });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter(
    i => i.productId.toString() !== productId
  );

  await cart.save();
  res.json(cart);
};

/* ================= CLEAR CART ================= */
exports.clearCart = async (req, res) => {
  const { userId } = req.body;

  await Cart.findOneAndDelete({ userId });
  res.json({ message: "Cart cleared" });
};
