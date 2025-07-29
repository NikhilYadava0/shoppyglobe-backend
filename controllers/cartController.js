const Cart = require('../models/Cart');

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  let cart = await Cart.findOne({ userId: req.user.userId });

  if (!cart) {
    cart = new Cart({ userId: req.user.userId, items: [{ productId, quantity }] });
  } else {
    const index = cart.items.findIndex(item => item.productId === productId);
    if (index >= 0) {
      cart.items[index].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
  }

  await cart.save();
  res.json(cart);
};

exports.updateCart = async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ userId: req.user.userId });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  const item = cart.items.find(item => item.productId === req.params.productId);
  if (item) item.quantity = quantity;
  await cart.save();
  res.json(cart);
};

exports.removeFromCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.userId });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  cart.items = cart.items.filter(item => item.productId !== req.params.productId);
  await cart.save();
  res.json(cart);
};
