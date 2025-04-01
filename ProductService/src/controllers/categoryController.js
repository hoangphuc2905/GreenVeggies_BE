const categoryService = require("../services/categoryService");

const categoryController = {
  getAllCategories: async (req, res) => {
    try {
      const categories = await categoryService.getAllCategories();
      res.status(200).json(categories);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getCategoryById: async (req, res) => {
    try {
      const category = await categoryService.getCategoryById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(200).json(category);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  createCategory: async (req, res) => {
    try {
      if (!req.body.name) {
        return res.status(400).json({ message: "Tên danh mục là bắt buộc." });
      }
      if (!req.body.description) {
        return res.status(400).json({ message: "Mô tả danh mục là bắt buộc." });
      }

      const count = await categoryService.countCategories();
      const newCategoryID = `CATE${String(count + 1).padStart(4, "0")}`;

      const categoryData = { ...req.body, categoryID: newCategoryID };
      const category = await categoryService.createCategory(categoryData);

      res.status(201).json(category);
    } catch (err) {
      res.status(400).json({ message: `Lỗi khi tạo danh mục: ${err.message}` });
    }
  },

  updateCategory: async (req, res) => {
    try {
      if (!req.body.name) {
        return res.status(400).json({ message: "Tên danh mục là bắt buộc." });
      }
      if (!req.body.description) {
        return res.status(400).json({ message: "Mô tả danh mục là bắt buộc." });
      }

      const category = await categoryService.updateCategory(
        req.params.id,
        req.body
      );
      if (!category) {
        return res.status(404).json({ message: "Không tìm thấy danh mục." });
      }
      res.status(200).json(category);
    } catch (err) {
      res
        .status(400)
        .json({ message: `Lỗi khi cập nhật danh mục: ${err.message}` });
    }
  },
};

module.exports = categoryController;
