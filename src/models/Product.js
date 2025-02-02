    const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    pID: {
      type: String,
      required: [true, "Please provide a product ID"],
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Please provide a product name"],
    },
    description: {
      type: String,
      required: [true, "Please provide a product description"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a product price"],
    },
    quantity: {
      type: Number,
      required: [true, "Please provide a product stock quantity"],
      min: [0, "Stock cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Please specify the product category"],
    },
    imageUrl: {
      type: Array,
      required: [true, "Please provide at least one image"],
    },
    unit: {
      type: String,
      required: [true, "Please specify the product unit"],
    },
    status: {
      type: String,
      required: [true, "Please specify the product status"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
