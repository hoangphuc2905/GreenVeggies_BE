const Review = require("../models/Review");
const Product = require("../models/Product");

const reviewController = {
  createReview: async (req, res) => {
    try {
      const { userID, productID, rating, comment, imageUrl } = req.body;

      // Tìm sản phẩm theo productID
      const product = await Product.findById(productID);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Tạo reviewID tự động
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      const lastReview = await Review.findOne({ productID }).sort({
        reviewID: -1,
      });

      let newID = `RV${product.productID}-${year}${month}${day}${hours}${minutes}${seconds}-001`;

      if (lastReview && lastReview.reviewID) {
        const lastID = parseInt(lastReview.reviewID.split("-")[2]);
        newID = `RV${
          product.productID
        }-${year}${month}${day}${hours}${minutes}${seconds}-${String(
          lastID + 1
        ).padStart(3, "0")}`;
      }

      const newReview = new Review({
        reviewID: newID,
        userID,
        productID,
        rating,
        comment,
        imageUrl,
      });

      await newReview.save();

      // Cập nhật sản phẩm với ID của đánh giá mới
      await Product.findByIdAndUpdate(
        productID,
        { $push: { reviews: newReview._id } },
        { new: true }
      );

      res
        .status(201)
        .json({ message: "Review created successfully", review: newReview });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getReviews: async (req, res) => {
    try {
      const reviews = await Review.find();
      res.status(200).json(reviews);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getReviewById: async (req, res) => {
    try {
      const { id } = req.params;
      const review = await Review.findById(id);
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
      res.status(200).json(review);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateReview: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedReview = await Review.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!updatedReview) {
        return res.status(404).json({ message: "Review not found" });
      }
      res.status(200).json({
        message: "Review updated successfully",
        review: updatedReview,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = reviewController;
