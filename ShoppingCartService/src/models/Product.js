const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productID: {
      type: String,
      unique: true,
      immutable: true,
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
      required: true,
      default: 0,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    import: {
      type: Number,
      required: true,
      default: 0,
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
      type: [String],
      default: [],
      required: [true, "Please provide at least one image"],
    },
    unit: {
      type: String,
      enum: ["piece", "kg", "gram", "liter", "ml"],
      required: [true, "Please specify the product unit"],
    },
    status: {
      type: String,
      enum: ["available", "unavailable", "out_of_stock"],
      default: "available",
      required: [true, "Please specify the product status"],
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    stockEntries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StockEntry",
      },
    ],
  },
  { timestamps: true }
);

// Middleware tạo productID tự động
productSchema.pre("save", async function (next) {
  if (!this.productID) {
    const lastProduct = await mongoose
      .model("Product")
      .findOne()
      .sort({ productID: -1 });
    let newID = "SP0001";

    if (lastProduct && lastProduct.productID) {
      const lastID = parseInt(lastProduct.productID.substring(2));
      newID = `SP${String(lastID + 1).padStart(4, "0")}`;
    }

    this.productID = newID;
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
