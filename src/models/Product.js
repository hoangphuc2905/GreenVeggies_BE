const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productID: {
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
    sold: {
      type: Number,
      required: [true, "Please provide a product sold number"],
    },
    quantity: {
      type: Number,
      required: [true, "Please provide a product inventory number"],
    },
    import: {
      type: Number,
      required: [true, "Please provide a product import number"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Please specify the product category"],
    },
    origin: {
      type: String,
      required: [true, "Please specify the product origin"],
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
    review: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Review",
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
