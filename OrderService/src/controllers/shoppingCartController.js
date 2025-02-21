const ShoppingCart = require("../models/ShoppingCart");

// Create a new shopping cart
exports.createShoppingCart = async (req, res) => {
  try {
    const shoppingCart = new ShoppingCart(req.body);
    await shoppingCart.save();
    res.status(201).json(shoppingCart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all shopping carts
exports.getAllShoppingCarts = async (req, res) => {
  try {
    const shoppingCarts = await ShoppingCart.find().populate("userId items.productId");
    res.status(200).json(shoppingCarts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get shopping cart by ID
exports.getShoppingCartById = async (req, res) => {
  try {
    const shoppingCart = await ShoppingCart.findById(req.params.id).populate("userId items.productId");
    if (!shoppingCart) {
      return res.status(404).json({ error: "Shopping cart not found" });
    }
    res.status(200).json(shoppingCart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update shopping cart
exports.updateShoppingCart = async (req, res) => {
  try {
    const shoppingCart = await ShoppingCart.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!shoppingCart) {
      return res.status(404).json({ error: "Shopping cart not found" });
    }
    res.status(200).json(shoppingCart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};