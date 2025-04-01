const Review = require("../models/Review");
const Product = require("../models/Product");

const reviewController = {
  createReview: async (req, res) => {
    try {
      const { userID, productID, rating, comment, imageUrl } = req.body;

      // Kiểm tra các trường bắt buộc
      if (!userID) {
        return res.status(400).json({ message: "Thiếu trường userID" });
      }
      if (!productID) {
        return res.status(400).json({ message: "Thiếu trường productID" });
      }
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating phải từ 1 đến 5" });
      }
      if (!comment) {
        return res.status(400).json({ message: "Thiếu trường comment" });
      }

      // Tìm sản phẩm theo productID
      const product = await Product.findOne({ productID });
      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }

      const newReview = new Review({
        userID,
        productID,
        rating,
        comment,
        imageUrl,
      });

      await newReview.save();

      // Cập nhật sản phẩm với ID của đánh giá mới
      await Product.findByIdAndUpdate(
        product._id,
        { $push: { reviews: newReview._id } },
        { new: true }
      );

      res
        .status(201)
        .json({ message: "Tạo đánh giá thành công", review: newReview });
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
      const { reviewID } = req.params;
      const review = await Review.findOne({ reviewID });
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
      const { reviewID } = req.params;
      const updatedReview = await Review.findOneAndUpdate(
        { reviewID },
        req.body,
        {
          new: true,
        }
      );
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
