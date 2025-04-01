const Order = require("../models/Order");
const OrderDetail = require("../models/OrderDetails");
const Product = require("../models/Product");

const orderController = {
  // Tạo đơn hàng mới
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
        address,
      } = req.body;

      // Kiểm tra các trường bắt buộc
      if (!userID) {
        throw new Error("Vui lòng cung cấp mã người dùng (userID)");
      }
      if (
        !orderDetails ||
        !Array.isArray(orderDetails) ||
        orderDetails.length === 0
      ) {
        throw new Error("Vui lòng cung cấp chi tiết đơn hàng (orderDetails)");
      }
      if (!totalQuantity || totalQuantity <= 0) {
        throw new Error("Tổng số lượng (totalQuantity) phải lớn hơn 0");
      }
      if (!totalAmount || totalAmount <= 0) {
        throw new Error("Tổng số tiền (totalAmount) phải lớn hơn 0");
      }
      if (!paymentMethod) {
        throw new Error(
          "Vui lòng cung cấp phương thức thanh toán (paymentMethod)"
        );
      }
      if (!address) {
        throw new Error("Vui lòng cung cấp địa chỉ giao hàng (address)");
      }

      // Tạo đơn hàng trước để lấy orderID
      const currentDate = new Date();
      const orderDate = `${String(currentDate.getDate()).padStart(
        2,
        "0"
      )}${String(currentDate.getMonth() + 1).padStart(2, "0")}${String(
        currentDate.getFullYear()
      ).slice(2)}`;

      const orderCount = await Order.countDocuments({
        createdAt: {
          $gte: new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate()
          ),
          $lt: new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() + 1
          ),
        },
      });
      const orderNumber = String(orderCount + 1).padStart(4, "0");
      const userNumber = userID.replace(/\D/g, "");

      // Gán orderID trước khi lưu
      const newOrder = new Order({
        orderID: `HD${orderNumber}${userNumber}${orderDate}`,
        userID,
        orderDetails: [],
        totalQuantity,
        totalAmount,
        paymentMethod,
        address,
      });
      await newOrder.save({ session });

      // Kiểm tra và cập nhật số lượng sản phẩm
      const orderDetailDocs = [];
      for (const detail of orderDetails) {
        const { productID, quantity } = detail;

        // Tìm sản phẩm bằng productID
        const product = await Product.findOne({ productID }).session(session);
        if (!product) {
          throw new Error(`Product with ID ${productID} not found`);
        }

        // Kiểm tra số lượng sản phẩm trong kho
        if (product.quantity < quantity) {
          throw new Error(`Not enough stock for product ${product.name}`);
        }

        // Trừ số lượng sản phẩm trong kho
        product.quantity -= quantity;

        // Cộng dồn số lượng bán (sold)
        product.sold = (product.sold || 0) + quantity;

        // Lưu sản phẩm sau khi cập nhật
        await product.save({ session });

        // Tạo chi tiết đơn hàng với orderID
        const orderDetail = new OrderDetail({
          orderID: newOrder.orderID, // Gán orderID sau khi Order đã được lưu
          productID,
          quantity,
          totalAmount: product.price * 1.5 * quantity, // Tính giá bán thành tiền
        });
        await orderDetail.save({ session });
        orderDetailDocs.push(orderDetail);
      }

      // Cập nhật danh sách orderDetails trong Order
      newOrder.orderDetails = orderDetailDocs.map((detail) => detail._id);
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
  // Lấy danh sách tất cả đơn hàng
  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.find().populate("orderDetails");
      // .populate("paymentMethod");
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Lấy thông tin đơn hàng theo ID
  getOrderById: async (req, res) => {
    try {
      const order = await Order.findOne({
        orderID: req.params.orderID,
      }).populate("orderDetails");
      // .populate("paymentMethod");
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Xóa đơn hàng
  deleteOrder: async (req, res) => {
    const session = await Order.startSession();
    session.startTransaction();
    try {
      // Xóa chi tiết đơn hàng liên quan
      await OrderDetail.deleteMany({ orderID: req.params.orderID }).session(
        session
      );

      // Xóa đơn hàng
      const deletedOrder = await Order.findByIdAndDelete(
        req.params.orderID
      ).session(session);
      if (!deletedOrder) {
        throw new Error("Order not found");
      }

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({ error: error.message });
    }
  },

  updateOrder: async (req, res) => {
    try {
      const { orderID } = req.params;
      const { status } = req.body;

      const updatedOrder = await Order.findOneAndUpdate(
        { orderID },
        { status },
        { new: true, runValidators: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.status(200).json({
        message: "Order updated successfully",
        order: updatedOrder,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = orderController;
