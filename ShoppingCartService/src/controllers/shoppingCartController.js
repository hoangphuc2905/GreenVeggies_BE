const ShoppingCartDetail = require("../models/ShoppingCartDetail");
const ShoppingCart = require("../models/ShoppingCart");
const shoppingCartService = require("../services/shoppingCartService");

const shoppingCartController = {
  // Create or update shopping cart
  createOrUpdateShoppingCart: async (req, res) => {
    try {
      const { userID, items, totalPrice } = req.body;

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
        if (detailMap.has(item.productID.toString())) {
          // Nếu sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng và tổng giá
          let detail = detailMap.get(item.productID.toString());
          detail.quantity += item.quantity;
          detail.totalAmount += item.price * item.quantity;
          await detail.save();
        } else {
          // Nếu sản phẩm chưa tồn tại, thêm mới vào giỏ hàng
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

      // Cập nhật danh sách chi tiết giỏ hàng trong giỏ hàng chính
      shoppingCart.shoppingCartDetailID = Array.from(detailMap.values()).map(
        (detail) => detail.shoppingCartDetailID
      );
      await shoppingCart.save();

      return res.status(201).json({
        message: "Giỏ hàng được tạo hoặc cập nhật thành công",
        shoppingCart,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  // Get all shopping carts
  getAllShoppingCarts: async (req, res) => {
    try {
      const shoppingCarts = await shoppingCartService.getAllShoppingCarts();
      res.status(200).json(shoppingCarts);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get shopping cart by shoppingCartID
  getShoppingCartByID: async (req, res) => {
    try {
      const shoppingCart = await shoppingCartService.getShoppingCartByID(
        req.params.shoppingCartID
      );
      if (!shoppingCart) {
        return res.status(404).json({ error: "Shopping cart not found" });
      }
      res.status(200).json(shoppingCart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get shopping cart by userID
  getShoppingCartByUserID: async (req, res) => {
    try {
      const shoppingCart = await shoppingCartService.getShoppingCartByUserID(
        req.params.userID
      );
      if (!shoppingCart) {
        return res.status(404).json({ error: "Shopping cart not found" });
      }
      res.status(200).json(shoppingCart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Delete shopping cart
  deleteShoppingCart: async (req, res) => {
    try {
      const shoppingCart = await shoppingCartService.deleteShoppingCart(
        req.params.shoppingCartID
      );
      if (!shoppingCart) {
        return res.status(404).json({ error: "Shopping cart not found" });
      }

      // Xóa tất cả các chi tiết giỏ hàng liên quan
      await ShoppingCartDetail.deleteMany({
        shoppingCartID: shoppingCart.shoppingCartID,
      });

      res.status(200).json({ message: "Giỏ hàng đã được xóa thành công" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteShoppingCartDetail: async (req, res) => {
    try {
      const shoppingCartDetail =
        await shoppingCartService.deleteShoppingCartDetail(
          req.params.shoppingCartDetailID
        );

      if (!shoppingCartDetail) {
        return res
          .status(404)
          .json({ error: "Shopping cart detail not found" });
      }

      // Cập nhật tổng giá của giỏ hàng chính
      const shoppingCart = await ShoppingCart.findOne({
        shoppingCartID: shoppingCartDetail.shoppingCartID,
      });
      shoppingCart.totalPrice -= shoppingCartDetail.totalAmount;
      await shoppingCart.save();

      res.status(200).json({
        message: "Chi tiết giỏ hàng đã được xóa thành công",
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateQuantity: async (req, res) => {
    const { shoppingCartID, productID, quantity } = req.body;

    try {
      // Kiểm tra giỏ hàng
      const shoppingCart = await ShoppingCart.findOne({ shoppingCartID });
      if (!shoppingCart) {
        return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
      }

      // Kiểm tra chi tiết giỏ hàng
      const shoppingCartDetail = await ShoppingCartDetail.findOne({
        shoppingCartID,
        productID,
      });
      if (!shoppingCartDetail) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" });
      }

      // Cập nhật số lượng và tổng giá
      shoppingCartDetail.quantity = quantity;
      shoppingCartDetail.totalAmount = quantity * shoppingCartDetail.totalAmount / shoppingCartDetail.quantity;
      await shoppingCartDetail.save();

      // Cập nhật tổng giá của giỏ hàng
      const allDetails = await ShoppingCartDetail.find({ shoppingCartID });
      shoppingCart.totalPrice = allDetails.reduce((sum, detail) => sum + detail.totalAmount, 0);
      await shoppingCart.save();

      res.status(200).json({ message: "Cập nhật số lượng thành công", shoppingCart });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error });
    }
  },

};

module.exports = shoppingCartController;
