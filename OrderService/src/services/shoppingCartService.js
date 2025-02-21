const ShoppingCart = require("../models/ShoppingCart");

exports.createShoppingCart = async (shoppingCartData) => {
  const shoppingCart = new ShoppingCart(shoppingCartData);
  return await shoppingCart.save();
};

exports.getAllShoppingCarts = async () => {
  return await ShoppingCart.find().populate("userId items.productId");
};

exports.getShoppingCartById = async (id) => {
  return await ShoppingCart.findById(id).populate("userId items.productId");
};

exports.updateShoppingCart = async (id, shoppingCartData) => {
  return await ShoppingCart.findByIdAndUpdate(id, shoppingCartData, {
    new: true,
    runValidators: true,
  });
};
