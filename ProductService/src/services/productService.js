const Review = require("../models/Review");
const Product = require("../models/Product");

const productService = {
  getLastProduct: async () => {
    return await Product.findOne().sort({ createdAt: -1 });
  },

  createProduct: async (productData) => {
    return await Product.create(productData);
  },

  getAllProducts: async () => {
    return await Product.find().populate("category").populate("reviews");
  },

  getProductById: async (productID) => {
    return await Product.findOne({ productID })
      .populate("category")
      .populate("reviews");
  },

  updateProduct: async (productID, productData) => {
    return await Product.findOneAndUpdate({ productID }, productData, {
      new: true,
    })
      .populate("category")
      .populate("reviews");
  },

};

module.exports = productService;
