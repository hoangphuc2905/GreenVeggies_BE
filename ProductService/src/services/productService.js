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
    return await Product.find().populate("category").populate("review");
  },

  getProductById: async (id) => {
    return await Product.findById(id).populate("category").populate("review");
  },

  updateProduct: async (id, productData) => {
    return await Product.findByIdAndUpdate(id, productData, { new: true });
  },
};

module.exports = productService;
