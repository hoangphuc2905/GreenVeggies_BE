const Order = require("../models/Order");
const Product = require("../models/Product");

const orderController = {
  // Create a new order
  createOrder: async (req, res) => {
    const session = await Order.startSession();
    session.startTransaction();
    try {
      const {
        userID,
        orderDetails,
        totalQuantity,
        totalAmount,
        paymentMethod,
      } = req.body;

      // Kiểm tra và cập nhật số lượng sản phẩm
      for (const detail of orderDetails) {
        const { productID, quantity } = detail;

        // Tìm sản phẩm
        const product = await Product.findById(productID).session(session);
        if (!product) {
          throw new Error(`Product with ID ${productID} not found`);
        }

        // Kiểm tra số lượng sản phẩm trong kho
        if (product.quantity < quantity) {
          throw new Error(`Not enough stock for product ${product.name}`);
        }

        // Trừ số lượng sản phẩm
        product.quantity -= quantity;
        await product.save({ session });
      }

      // Tạo đơn hàng
      const newOrder = new Order({
        userID,
        orderDetails,
        totalQuantity,
        totalAmount,
        paymentMethod,
      });

      // Lưu đơn hàng
      await newOrder.save({ session });

      // Commit transaction
      await session.commitTransaction();
      session.endSession();

      res.status(201).json({
        message: "Order created successfully",
        order: newOrder,
      });
    } catch (error) {
      // Rollback transaction nếu có lỗi
      await session.abortTransaction();
      session.endSession();
      res.status(400).json({ error: error.message });
    }
  },

  // Get all orders
  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.find().populate(
        "userID orderDetails paymentMethod"
      );
      res.status(200).json(orders);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get order by ID
  getOrderById: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id).populate(
        "userID orderDetails paymentMethod"
      );
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.status(200).json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Update order
  updateOrder: async (req, res) => {
    try {
      const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.status(200).json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = orderController;
