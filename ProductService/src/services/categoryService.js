const Category = require("../models/Category");

const categoryService = {
  getAllCategories: async () => {
    return await Category.find();
  },

  getCategoryById: async (id) => {
    return await Category.findOne({ categoryID: id });
  },

  createCategory: async (categoryData) => {
    return await Category.create(categoryData);
  },

  updateCategory: async (id, updateData) => {
    return await Category.findOneAndUpdate({ categoryID: id }, updateData, { new: true });
  },

  countCategories: async () => {
    return await Category.countDocuments();
  },
};

module.exports = categoryService;
