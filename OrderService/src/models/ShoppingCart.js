const mongoose = require("mongoose");

const shoppingCartSchema = new mongoose.Schema(
  {
    shoppingCartID: {
      type: String,
      required: true,
      unique: true,
    },
    userID: {
      type: String,
      ref: "User",
      required: true,
    },
    shoppingCartDetailID: [
      {
        type: String, 
        ref: "ShoppingCartDetail",
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShoppingCart", shoppingCartSchema);
