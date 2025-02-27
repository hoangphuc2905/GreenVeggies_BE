const productService = require("../services/productService");

const productController = {
  getAllProducts: async (req, res) => {
    try {
      const products = await productService.getAllProducts();
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getProductById: async (req, res) => {
    try {
      const product = await productService.getProductById(req.params.productID);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  createProduct: async (req, res) => {
    try {
      // Tạo mã sản phẩm tự động
      const lastProduct = await productService.getLastProduct();
      let newID = "SP0001";

      if (lastProduct && lastProduct.productID) {
        const lastID = parseInt(lastProduct.productID.replace("SP", ""));
        newID = `SP${("000" + (lastID + 1)).slice(-4)}`;
      }

      const newProduct = {
        ...req.body,
        productID: newID,
      };

      const product = await productService.createProduct(newProduct);
      res.status(201).json(product);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  updateProduct: async (req, res) => {
    try {
      if (req.body.productID) {
        return res
          .status(400)
          .json({ message: "Không thể chỉnh sửa mã sản phẩm!" });
      }

      const product = await productService.updateProduct(
        req.params.productID,
        req.body
      );
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json(product);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  getProductsByCategory: async (req, res) => {
    try {
      const { categoryID } = req.params;
      const products = await productService.getProductsByCategory(categoryID);
      res.status(200).json(products);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  searchProductbyName: async (req, res) => {
    try {
      const { keyword } = req.query;
      const products = await productService.searchProductbyName(keyword);
      if (products.length === 0) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json(products);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = productController;
