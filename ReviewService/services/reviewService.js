const Review = require("../models/Review");

const reviewService = {
  createReview: async (reviewData) => {
    const newReview = new Review(reviewData);
    return await newReview.save();
  },

  getReviews: async () => {
    return await Review.find();
  },

  getReviewById: async (id) => {
    return await Review.findById(id);
  },

  updateReview: async (id, reviewData) => {
    return await Review.findByIdAndUpdate(id, reviewData, { new: true });
  },

};

module.exports = reviewService;