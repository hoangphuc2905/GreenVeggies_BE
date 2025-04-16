const mongoose = require("mongoose");

const stockEntrySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    entryDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    entryPrice: {
      type: Number,
      required: true,
    },
    entryQuantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockEntry", stockEntrySchema);    