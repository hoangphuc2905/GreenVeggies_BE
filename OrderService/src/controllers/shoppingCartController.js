const ShoppingCart = require("../models/ShoppingCart");
const ShoppingCartDetail = require("../models/ShoppingCartDetail");

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
      const shoppingCarts = await ShoppingCart.find().populate({
        path: "shoppingCartDetailID",
        model: "ShoppingCartDetail",
      });
      res.status(200).json(shoppingCarts);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get shopping cart by shoppingCartID
  getShoppingCartById: async (req, res) => {
    try {
      const shoppingCart = await ShoppingCart.findOne({
        shoppingCartID: req.params.id,
      }).populate({
        path: "shoppingCartDetailID",
        model: "ShoppingCartDetail",
      });
      if (!shoppingCart) {
        return res.status(404).json({ error: "Shopping cart not found" });
      }
      res.status(200).json(shoppingCart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get shopping cart by userID
  getShoppingCartByUserId: async (req, res) => {
    try {
      const shoppingCart = await ShoppingCart.findOne({
        userID: req.params.userID,
      }).populate({
        path: "shoppingCartDetailID",
        model: "ShoppingCartDetail",
      });
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
      const shoppingCart = await ShoppingCart.findOneAndDelete({
        shoppingCartID: req.params.id,
      });
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
};

module.exports = shoppingCartController;
