const mongoose = require("mongoose");

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

module.exports = mongoose.model("Review", reviewSchema);