const Review = require("../models/Review");

const reviewService = {
  createReview: async (reviewData) => {
    const newReview = new Review(reviewData);
    return await newReview.save();
  },

  getReviews: async () => {
    return await Review.find();
  },

  getReviewById: async (reviewID) => {
    return await Review.findOne({ reviewID });
  },

  updateReview: async (reviewID, reviewData) => {
    return await Review.findByIdAndUpdate(reviewID, reviewData, { new: true });
  },
};

module.exports = reviewService;
