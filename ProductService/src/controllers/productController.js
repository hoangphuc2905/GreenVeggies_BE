const productService = require("../services/productService");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dze57n4oa",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const productController = {
  getAllProducts: async (req, res) => {
    try {
      const products = await productService.getAllProducts();
      res.status(200).json(products);
    } catch (err) {
      res
        .status(500)
        .json({ errors: { server: "Lỗi máy chủ. Vui lòng thử lại sau." } });
    }
  },

  getProductById: async (req, res) => {
    try {
      const product = await productService.getProductById(req.params.productID);
      if (!product) {
        return res
          .status(404)
          .json({ errors: { productID: "Không tìm thấy sản phẩm." } });
      }
      res.status(200).json(product);
    } catch (err) {
      res
        .status(500)
        .json({ errors: { server: "Lỗi máy chủ. Vui lòng thử lại sau." } });
    }
  },

  createProduct: async (req, res) => {
    try {
      // Kiểm tra các trường bắt buộc
      const requiredFields = {
        name: "Vui lòng nhập tên sản phẩm.",
        description: "Vui lòng nhập mô tả sản phẩm.",
        price: "Vui lòng nhập giá sản phẩm.",
        quantity: "Vui lòng nhập số lượng sản phẩm.",
        category: "Vui lòng nhập danh mục sản phẩm.",
        origin: "Vui lòng nhập nguồn gốc sản phẩm.",
        imageUrl: "Vui lòng nhập URL hình ảnh sản phẩm.",
        unit: "Vui lòng nhập đơn vị sản phẩm.",
      };

      const errors = {};
      Object.keys(requiredFields).forEach((field) => {
        if (!req.body[field] || req.body[field].length === 0) {
          errors[field] = requiredFields[field];
        }
      });

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

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
      res
        .status(500)
        .json({
          errors: { server: "Lỗi khi tạo sản phẩm. Vui lòng thử lại sau." },
        });
    }
  },

  updateProduct: async (req, res) => {
    try {
      if (req.body.productID) {
        return res
          .status(400)
          .json({ errors: { productID: "Không thể chỉnh sửa mã sản phẩm." } });
      }

      // Kiểm tra các trường bắt buộc
      const requiredFields = {
        name: "Vui lòng nhập tên sản phẩm.",
        description: "Vui lòng nhập mô tả sản phẩm.",
        price: "Vui lòng nhập giá sản phẩm.",
        category: "Vui lòng nhập danh mục sản phẩm.",
        origin: "Vui lòng nhập nguồn gốc sản phẩm.",
        imageUrl: "Vui lòng nhập URL hình ảnh sản phẩm.",
        unit: "Vui lòng nhập đơn vị sản phẩm.",
      };

      const errors = {};
      Object.keys(requiredFields).forEach((field) => {
        if (req.body[field] === undefined || req.body[field] === null) {
          errors[field] = requiredFields[field];
        }
      });

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      const product = await productService.updateProduct(
        req.params.productID,
        req.body
      );
      if (!product) {
        return res
          .status(404)
          .json({ errors: { productID: "Không tìm thấy sản phẩm." } });
      }
      res.status(200).json(product);
    } catch (err) {
      res
        .status(500)
        .json({ errors: { server: "Lỗi máy chủ. Vui lòng thử lại sau." } });
    }
  },

  updateProductStatus: async (req, res) => {
    try {
      const { status } = req.body;

      // Chỉ chấp nhận 3 trạng thái cụ thể
      const validStatuses = ["available", "unavailable", "out_of_stock"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          errors: {
            status: `Trạng thái không hợp lệ. Chỉ chấp nhận các trạng thái: ${validStatuses.join(
              ", "
            )}.`,
          },
        });
      }

      const product = await productService.updateProductStatus(
        req.params.productID,
        status
      );

      if (!product) {
        return res
          .status(404)
          .json({ errors: { productID: "Không tìm thấy sản phẩm." } });
      }

      res.status(200).json(product);
    } catch (err) {
      res
        .status(500)
        .json({ errors: { server: "Lỗi máy chủ. Vui lòng thử lại sau." } });
    }
  },

  getProductsByCategory: async (req, res) => {
    try {
      const { categoryID } = req.params;
      const products = await productService.getProductsByCategory(categoryID);
      res.status(200).json(products);
    } catch (error) {
      res
        .status(500)
        .json({ errors: { server: "Lỗi máy chủ. Vui lòng thử lại sau." } });
    }
  },

  searchProductbyName: async (req, res) => {
    try {
      const { keyword } = req.query;
      const products = await productService.searchProductbyName(keyword);
      if (products.length === 0) {
        return res
          .status(404)
          .json({ errors: { keyword: "Không tìm thấy sản phẩm." } });
      }
      res.status(200).json(products);
    } catch (error) {
      res
        .status(500)
        .json({ errors: { server: "Lỗi máy chủ. Vui lòng thử lại sau." } });
    }
  },

  deleteImage: async (req, res) => {
    const { publicId } = req.body;
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      if (result.result === "ok") {
        res.json({ success: true, message: "Xóa ảnh thành công!" });
      } else {
        res
          .status(400)
          .json({
            errors: { image: "Không thể xóa ảnh. Vui lòng kiểm tra lại." },
          });
      }
    } catch (error) {
      res
        .status(500)
        .json({ errors: { server: "Lỗi máy chủ. Vui lòng thử lại sau." } });
    }
  },
};

module.exports = productController;
