const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderID: {
      type: String,
      required: [true, "Please provide an order ID"],
      unique: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user ID"],
    },
    productID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Please provide a product ID"],
    },
    quantity: {
      type: Number,
      required: [true, "Please provide the quantity of products ordered"],
      min: [1, "Quantity must be at least 1"],
    },
    totalAmount: {
      type: Number,
      required: [true, "Please provide the total amount for the order"],
    },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);