const Review = require("../models/Review");
const Product = require("../models/Product");

const reviewController = {
  createReview: async (req, res) => {
    try {
      const errors = {};
      const { userID, productID, rating, comment, imageUrl } = req.body;

      if (!userID) {
        errors.userID = "Vui lòng cung cấp mã người dùng.";
      }
      if (!productID) {
        errors.productID = "Vui lòng cung cấp mã sản phẩm.";
      }
      if (!rating) {
        errors.rating = "Vui lòng cung cấp đánh giá.";
      } else if (rating < 1 || rating > 5) {
        errors.rating = "Đánh giá phải nằm trong khoảng từ 1 đến 5.";
      }
      if (!comment) {
        errors.comment = "Vui lòng cung cấp nội dung đánh giá.";
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      const product = await Product.findOne({ productID });
      if (!product) {
        return res.status(404).json({
          errors: { productID: "Không tìm thấy sản phẩm." },
        });
      }

      const newReview = new Review({
        userID,
        productID,
        rating,
        comment,
        imageUrl,
      });

      await newReview.save();

      // Update product with the new review ID
      await Product.findByIdAndUpdate(
        product._id,
        { $push: { reviews: newReview._id } },
        { new: true }
      );

      res.status(201).json({
        message: "Tạo đánh giá thành công.",
        review: newReview,
      });
    } catch (error) {
      res
        .status(400)
        .json({ errors: { server: `Đã xảy ra lỗi: ${error.message}` } });
    }
  },

  getReviews: async (req, res) => {
    try {
      const reviews = await Review.find();
      res.status(200).json(reviews);
    } catch (error) {
      res
        .status(400)
        .json({ errors: { server: `Đã xảy ra lỗi: ${error.message}` } });
    }
  },

  getReviewById: async (req, res) => {
    try {
      const errors = {};
      const { reviewID } = req.params;

      if (!reviewID) {
        errors.reviewID = "Vui lòng cung cấp reviewID.";
        return res.status(400).json({ errors });
      }

      const review = await Review.findOne({ reviewID });
      if (!review) {
        return res.status(404).json({
          errors: { reviewID: "Không tìm thấy đánh giá." },
        });
      }

      res.status(200).json(review);
    } catch (error) {
      res
        .status(400)
        .json({ errors: { server: `Đã xảy ra lỗi: ${error.message}` } });
    }
  },

  updateReview: async (req, res) => {
    try {
      const errors = {};
      const { reviewID } = req.params;

      if (!reviewID) {
        errors.reviewID = "Vui lòng cung cấp reviewID.";
        return res.status(400).json({ errors });
      }

      const updatedReview = await Review.findOneAndUpdate(
        { reviewID },
        req.body,
        { new: true }
      );

      if (!updatedReview) {
        return res.status(404).json({
          errors: { reviewID: "Không tìm thấy đánh giá." },
        });
      }

      res.status(200).json({
        message: "Cập nhật đánh giá thành công.",
        review: updatedReview,
      });
    } catch (error) {
      res
        .status(400)
        .json({ errors: { server: `Đã xảy ra lỗi: ${error.message}` } });
    }
  },
};

module.exports = reviewController;
