const categoryService = require("../services/categoryService");

const categoryController = {
  // Lấy tất cả danh mục
  getAllCategories: async (req, res) => {
    try {
      const categories = await categoryService.getAllCategories();
      res.status(200).json(categories);
    } catch (err) {
      res.status(500).json({
        errors: { server: "Lỗi máy chủ: " + err.message },
      });
    }
  },

  // Lấy danh mục theo ID
  getCategoryById: async (req, res) => {
    try {
      const category = await categoryService.getCategoryById(req.params.id);
      if (!category) {
        return res.status(404).json({
          errors: { categoryID: "Không tìm thấy danh mục." },
        });
      }
      res.status(200).json(category);
    } catch (err) {
      res.status(500).json({
        errors: { server: "Lỗi máy chủ: " + err.message },
      });
    }
  },

  // Tạo danh mục mới
  createCategory: async (req, res) => {
    try {
      const errors = {};

      // Kiểm tra tên danh mục
      if (!req.body.name) {
        errors.name = "Vui lòng nhập tên danh mục.";
      }

      // Nếu có lỗi, trả về object lỗi
      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      // Kiểm tra trùng lặp tên danh mục
      const existingCategory = await categoryService.getCategoryByName(
        req.body.name
      );
      if (existingCategory) {
        return res.status(400).json({
          errors: { name: "Tên danh mục đã tồn tại." },
        });
      }

      // Tạo danh mục mới
      const category = await categoryService.createCategory(req.body);
      res.status(201).json(category);
    } catch (err) {
      res.status(500).json({
        errors: { server: "Lỗi khi tạo danh mục: " + err.message },
      });
    }
  },

  // Cập nhật danh mục
  updateCategory: async (req, res) => {
    try {
      const errors = {};

      // Kiểm tra tên danh mục
      if (!req.body.name) {
        errors.name = "Vui lòng nhập tên danh mục.";
      }

      // Nếu có lỗi, trả về object lỗi
      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      // Kiểm tra trùng lặp tên danh mục (trừ danh mục hiện tại)
      const existingCategory = await categoryService.getCategoryByName(
        req.body.name
      );
      if (
        existingCategory &&
        existingCategory._id.toString() !== req.params.id
      ) {
        return res.status(400).json({
          errors: { name: "Tên danh mục đã tồn tại." },
        });
      }

      // Cập nhật danh mục
      const category = await categoryService.updateCategory(
        req.params.id,
        req.body
      );
      if (!category) {
        return res.status(404).json({
          errors: { categoryID: "Không tìm thấy danh mục." },
        });
      }
      res.status(200).json(category);
    } catch (err) {
      res.status(500).json({
        errors: { server: "Lỗi khi cập nhật danh mục: " + err.message },
      });
    }
  },
};

module.exports = categoryController;
