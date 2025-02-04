const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    paymentID: {
      type: String,
      required: [true, "Please provide a payment ID"],
      unique: true,
    },
    orderID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Please provide an order ID"],
    },
    paymentMethod: {
      type: String,
      required: [true, "Please provide a payment method"],
      enum: ["Momo", "Bank Transfer", "Cash"],
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded"],
      default: "Pending",
    },
    amount: {
      type: Number,
      required: [true, "Please provide the payment amount"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
