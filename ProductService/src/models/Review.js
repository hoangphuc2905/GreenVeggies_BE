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

// Middleware tạo reviewID tự động
reviewSchema.pre("save", async function (next) {
  if (!this.reviewID) {
    const product = await mongoose.model("Product").findById(this.productID);
    if (!product) {
      throw new Error("Product not found");
    }

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    const lastReview = await mongoose
      .model("Review")
      .findOne({ productID: this.productID })
      .sort({ reviewID: -1 });

    let newID = `RV${product.productID}-${year}${month}${day}${hours}${minutes}${seconds}-001`;

    if (lastReview && lastReview.reviewID) {
      const lastID = parseInt(lastReview.reviewID.split("-")[2]);
      newID = `RV${
        product.productID
      }-${year}${month}${day}${hours}${minutes}${seconds}-${String(
        lastID + 1
      ).padStart(3, "0")}`;
    }

    this.reviewID = newID;
  }
  next();
});

module.exports = mongoose.model("Review", reviewSchema);
