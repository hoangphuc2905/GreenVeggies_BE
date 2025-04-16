const mongoose = require("mongoose");

const orderDetailSchema = new mongoose.Schema(
  {
    orderID: {
      type: String,
      ref: "Order",
      required: [true, "Please provide an order ID"],
    },
    productID: {
      type: String,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrderDetail", orderDetailSchema);