const ShoppingCartDetail = require("../models/ShoppingCartDetail");
const ShoppingCart = require("../models/ShoppingCart");
const shoppingCartService = require("../services/shoppingCartService");

const shoppingCartController = {
  // Create or update shopping cart
  createOrUpdateShoppingCart: async (req, res) => {
    try {
      const errors = {};
      const { userID, items, totalPrice } = req.body;

      if (!userID) {
        errors.userID = "Vui lòng cung cấp userID.";
      }
      if (!items || !Array.isArray(items) || items.length === 0) {
        errors.items = "Vui lòng cung cấp danh sách sản phẩm.";
      }
      if (!totalPrice || totalPrice <= 0) {
        errors.totalPrice = "Vui lòng cung cấp tổng giá hợp lệ.";
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      let shoppingCart = await ShoppingCart.findOne({ userID });

      if (!shoppingCart) {
        const shoppingCartID = `SC${Date.now()}`;
        shoppingCart = new ShoppingCart({
          shoppingCartID,
          userID,
          totalPrice,
        });
        await shoppingCart.save();
      } else {
        shoppingCart.totalPrice += totalPrice;
      }

      const existingDetails = await ShoppingCartDetail.find({
        shoppingCartID: shoppingCart.shoppingCartID,
      });

      const detailMap = new Map();
      existingDetails.forEach((detail) => {
        detailMap.set(detail.productID.toString(), detail);
      });

      for (const item of items) {
        if (!item.productID || !item.quantity || !item.price) {
          return res.status(400).json({
            errors: {
              item: "Mỗi sản phẩm phải có productID, quantity và price.",
            },
          });
        }

        if (detailMap.has(item.productID.toString())) {
          let detail = detailMap.get(item.productID.toString());
          detail.quantity += item.quantity;
          detail.totalAmount += item.price * item.quantity;
          await detail.save();
        } else {
          let newDetail = new ShoppingCartDetail({
            shoppingCartDetailID: `SCD${Date.now()}`,
            shoppingCartID: shoppingCart.shoppingCartID,
            productID: item.productID,
            quantity: item.quantity,
            description: item.description,
            totalAmount: item.price * item.quantity,
          });
          await newDetail.save();
          detailMap.set(item.productID.toString(), newDetail);
        }
      }

      shoppingCart.shoppingCartDetailID = Array.from(detailMap.values()).map(
        (detail) => detail.shoppingCartDetailID
      );
      await shoppingCart.save();

      return res.status(201).json({
        message: "Giỏ hàng được tạo hoặc cập nhật thành công.",
        shoppingCart,
      });
    } catch (error) {
      return res.status(500).json({
        errors: {
          server: "Đã xảy ra lỗi trên máy chủ.",
          message: error.message,
        },
      });
    }
  },

  // Get all shopping carts
  getAllShoppingCarts: async (req, res) => {
    try {
      const shoppingCarts = await shoppingCartService.getAllShoppingCarts();
      res.status(200).json(shoppingCarts);
    } catch (error) {
      res.status(400).json({
        errors: {
          server: "Không thể lấy danh sách giỏ hàng.",
          message: error.message,
        },
      });
    }
  },

  // Get shopping cart by shoppingCartID
  getShoppingCartByID: async (req, res) => {
    try {
      const { shoppingCartID } = req.params;

      if (!shoppingCartID) {
        return res.status(400).json({
          errors: { shoppingCartID: "Vui lòng cung cấp shoppingCartID." },
        });
      }

      const shoppingCart = await shoppingCartService.getShoppingCartByID(
        shoppingCartID
      );
      if (!shoppingCart) {
        return res.status(404).json({
          errors: { shoppingCartID: "Không tìm thấy giỏ hàng." },
        });
      }
      res.status(200).json(shoppingCart);
    } catch (error) {
      res.status(400).json({
        errors: { server: "Không thể lấy giỏ hàng.", message: error.message },
      });
    }
  },

  // Get shopping cart by userID
  getShoppingCartByUserID: async (req, res) => {
    try {
      const { userID } = req.params;

      if (!userID) {
        return res.status(400).json({
          errors: { userID: "Vui lòng cung cấp userID." },
        });
      }

      const shoppingCart = await shoppingCartService.getShoppingCartByUserID(
        userID
      );
      if (!shoppingCart) {
        return res.status(404).json({
          errors: { userID: "Không tìm thấy giỏ hàng." },
        });
      }
      res.status(200).json(shoppingCart);
    } catch (error) {
      res.status(400).json({
        errors: {
          server: "Không thể lấy giỏ hàng theo người dùng.",
          message: error.message,
        },
      });
    }
  },

  // ...existing code...

  // Xóa giỏ hàng
  deleteShoppingCart: async (req, res) => {
    try {
      const { shoppingCartID } = req.params;

      if (!shoppingCartID) {
        return res.status(400).json({
          errors: { shoppingCartID: "Vui lòng cung cấp shoppingCartID." },
        });
      }

      const deletedCart = await shoppingCartService.deleteShoppingCart(
        shoppingCartID
      );

      if (!deletedCart) {
        return res.status(404).json({
          errors: { shoppingCartID: "Không tìm thấy giỏ hàng." },
        });
      }

      return res
        .status(200)
        .json({ message: "Giỏ hàng đã được xóa thành công." });
    } catch (error) {
      return res.status(400).json({
        errors: { server: "Không thể xóa giỏ hàng.", message: error.message },
      });
    }
  },

  // Xóa chi tiết giỏ hàng
  deleteShoppingCartDetail: async (req, res) => {
    try {
      const { shoppingCartDetailID } = req.params;

      if (!shoppingCartDetailID) {
        return res.status(400).json({
          errors: {
            shoppingCartDetailID: "Vui lòng cung cấp shoppingCartDetailID.",
          },
        });
      }

      const deletedCartDetail =
        await shoppingCartService.deleteShoppingCartDetail(
          shoppingCartDetailID
        );

      if (!deletedCartDetail) {
        return res.status(404).json({
          errors: { shoppingCartDetailID: "Không tìm thấy chi tiết giỏ hàng." },
        });
      }

      // Cập nhật lại tổng giá của giỏ hàng chính
      const shoppingCart = await ShoppingCart.findOne({
        shoppingCartID: deletedCartDetail.shoppingCartID,
      });
      if (shoppingCart) {
        shoppingCart.totalPrice -= deletedCartDetail.totalAmount;
        if (shoppingCart.totalPrice < 0) shoppingCart.totalPrice = 0;
        await shoppingCart.save();
      }

      return res
        .status(200)
        .json({ message: "Chi tiết giỏ hàng đã được xóa thành công." });
    } catch (error) {
      return res.status(400).json({
        errors: {
          server: "Không thể xóa chi tiết giỏ hàng.",
          message: error.message,
        },
      });
    }
  },
  // ...existing code...

  // Update quantity of a product in the shopping cart
  updateQuantity: async (req, res) => {
    const { shoppingCartID, productID, quantity } = req.body;

    try {
      const errors = {};
      if (!shoppingCartID) {
        errors.shoppingCartID = "Vui lòng cung cấp shoppingCartID.";
      }
      if (!productID) {
        errors.productID = "Vui lòng cung cấp productID.";
      }
      if (!quantity || quantity <= 0) {
        errors.quantity = "Vui lòng cung cấp số lượng hợp lệ.";
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      // Check shopping cart
      const shoppingCart = await ShoppingCart.findOne({ shoppingCartID });
      if (!shoppingCart) {
        return res.status(404).json({
          errors: { shoppingCartID: "Không tìm thấy giỏ hàng." },
        });
      }

      // Check shopping cart detail
      const shoppingCartDetail = await ShoppingCartDetail.findOne({
        shoppingCartID,
        productID,
      });
      if (!shoppingCartDetail) {
        return res.status(404).json({
          errors: { productID: "Không tìm thấy sản phẩm trong giỏ hàng." },
        });
      }

      // Update quantity and total amount
      shoppingCartDetail.totalAmount =
        (shoppingCartDetail.totalAmount / shoppingCartDetail.quantity) *
        quantity;
      shoppingCartDetail.quantity = quantity;
      await shoppingCartDetail.save();

      // Update total price of the shopping cart
      const allDetails = await ShoppingCartDetail.find({ shoppingCartID });
      shoppingCart.totalPrice = allDetails.reduce(
        (sum, detail) => sum + detail.totalAmount,
        0
      );
      await shoppingCart.save();

      res.status(200).json({
        message: "Cập nhật số lượng thành công.",
        shoppingCart,
      });
    } catch (error) {
      res.status(500).json({
        errors: {
          server: "Đã xảy ra lỗi trên máy chủ.",
          message: error.message,
        },
      });
    }
  },
};

module.exports = shoppingCartController;
