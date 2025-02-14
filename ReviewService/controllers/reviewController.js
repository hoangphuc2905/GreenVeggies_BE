const Review = require("../models/Review");

const reviewController = {
  createReview: async (req, res) => {
    try {
      const { reviewID, userID, productID, rating, comment, imageUrl } =
        req.body;

      const newReview = new Review({
        reviewID,
        userID,
        productID,
        rating,
        comment,
        imageUrl,
      });

      await newReview.save();
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
      res
        .status(200)
        .json({
          message: "Review updated successfully",
          review: updatedReview,
        });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteReview: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedReview = await Review.findByIdAndDelete(id);
      if (!deletedReview) {
        return res.status(404).json({ message: "Review not found" });
      }
      res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = reviewController;
