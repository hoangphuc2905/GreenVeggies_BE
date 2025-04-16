const mongoose = require("mongoose");

const shoppingCartDetailSchema = new mongoose.Schema(
  {
    shoppingCartDetailID: {
      type: String,
      required: true,
      unique: true,
    },
    shoppingCartID: {
      type: String,
      ref: "ShoppingCart",
      required: true,
    },
    productID: {
      type: String,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    description: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShoppingCartDetail", shoppingCartDetailSchema);
