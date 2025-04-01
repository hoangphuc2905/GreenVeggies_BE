const Review = require("../models/Review");
const Product = require("../models/Product");
const { get } = require("mongoose");

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

  updateProductStatus: async (productID, status) => {
    return await Product.findOneAndUpdate(
      { productID },
      { status },
      { new: true }
    )
      .populate("category")
      .populate("reviews");
  },

  getProductsByCategory: async (categoryID) => {
    return await Product.getProductsByCategory(categoryID);
  },

  searchProductbyName: async (keyword) => {
    return await Product.find({
      name: { $regex: keyword, $options: "i" },
    })
      .populate("category")
      .populate("reviews");
  },
};

module.exports = productService;
