const mongoose = require("mongoose");
const Product = require("./Product");

const reviewSchema = new mongoose.Schema(
  {
    reviewID: {
      type: String,
      required: [true, "Please provide a review ID"],
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
    rating: {
      type: Number,
      required: [true, "Please provide a rating"],
    },
    comment: {
      type: String,
      required: [true, "Please provide a comment"],
    },
    imageUrl: {
      type: [String],
      default: [],
      required: false,
    },
  },
  { timestamps: true }
);

reviewSchema.post("save", async function (doc, next) {
  try {
    const product = await mongoose.model("Product").findById(doc.productID);
    if (product) {
      product.reviews.push(doc._id);
      await product.save();
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Review", reviewSchema);
