const productService = require("../services/productService");

const productController = {
  // Lấy danh sách tất cả sản phẩm
  getAllProducts: async (req, res) => {
    try {
      const products = await productService.getAllProducts();
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Lấy sản phẩm theo ID
  getProductById: async (req, res) => {
    try {
      const product = await productService.getProductById(req.params.id);
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Tạo sản phẩm mới
  createProduct: async (req, res) => {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json(product);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Cập nhật sản phẩm
  updateProduct: async (req, res) => {
    try {
      const product = await productService.updateProduct(
        req.params.id,
        req.body
      );
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Xóa sản phẩm
  deleteProduct: async (req, res) => {
    try {
      const product = await productService.deleteProduct(req.params.id);
      if (product) {
        res.status(200).json({ message: "Product deleted" });
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = productController;
