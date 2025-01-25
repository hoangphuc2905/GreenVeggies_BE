const Product = require("../models/Product");

const productService = {
  createProduct: async (productData) => {
    const product = new Product(productData);
    return await product.save();
  },

  getAllProducts: async () => {
    return await Product.find();
  },

  getProductById: async (id) => {
    return await Product.findById(id);
  },

  updateProduct: async (id, productData) => {
    return await Product.findByIdAndUpdate(id, productData, { new: true });
  },

  deleteProduct: async (id) => {
    return await Product.findByIdAndDelete(id);
  },
};

module.exports = productService;