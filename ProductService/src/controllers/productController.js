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
      const product = await productService.getProductById(req.params.id);
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
        req.params.id,
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
};

module.exports = productController;
