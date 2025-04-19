const Order = require("../models/Order");
const OrderDetail = require("../models/OrderDetails");
const Product = require("../models/Product");
const orderService = require("../services/orderService");
const User = require("../models/User");

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

      // Tạo object lưu trữ lỗi
      const errors = {};
      if (!userID) errors.userID = "Vui lòng cung cấp mã người dùng.";
      if (
        !orderDetails ||
        !Array.isArray(orderDetails) ||
        orderDetails.length === 0
      ) {
        errors.orderDetails = "Vui lòng cung cấp chi tiết đơn hàng.";
      }
      if (!totalQuantity || totalQuantity <= 0) {
        errors.totalQuantity = "Tổng số lượng phải lớn hơn 0.";
      }
      if (!totalAmount || totalAmount <= 0) {
        errors.totalAmount = "Tổng số tiền phải lớn hơn 0.";
      }
      if (!paymentMethod) {
        errors.paymentMethod = "Vui lòng cung cấp phương thức thanh toán .";
      }
      if (!address) {
        errors.address = "Vui lòng cung cấp địa chỉ giao hàng.";
      }

      // Nếu có lỗi, trả về object lỗi
      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
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
          return res.status(400).json({
            errors: {
              productID: `Không tìm thấy sản phẩm với ID ${productID}.`,
            },
          });
        }

        // Kiểm tra số lượng sản phẩm trong kho
        if (product.quantity < quantity) {
          return res.status(400).json({
            errors: {
              stock: `Sản phẩm ${product.name} không đủ số lượng trong kho. Số lượng còn lại: ${product.quantity}.`,
            },
          });
        }

        // Trừ số lượng sản phẩm trong kho
        product.quantity -= quantity;

        // Cộng dồn số lượng bán (sold)
        product.sold = (product.sold || 0) + quantity;

        // Lưu sản phẩm sau khi cập nhật
        await product.save({ session });

        // Tạo chi tiết đơn hàng với orderID
        const orderDetail = new OrderDetail({
          orderID: newOrder.orderID,
          productID,
          quantity,
          totalAmount: product.price * 1.5 * quantity,
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
        message: "Đơn hàng đã được tạo thành công.",
        order: newOrder,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({ errors: { server: error.message } });
    }
  },

  // Lấy danh sách tất cả đơn hàng
  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.find().populate("orderDetails");
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ errors: { server: error.message } });
    }
  },

  // Lấy thông tin đơn hàng theo ID
  getOrderById: async (req, res) => {
    try {
      const order = await Order.findOne({
        orderID: req.params.orderID,
      }).populate("orderDetails");
      if (!order) {
        return res
          .status(404)
          .json({ errors: { orderID: "Không tìm thấy đơn hàng." } });
      }
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ errors: { server: error.message } });
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
        return res
          .status(404)
          .json({ errors: { orderID: "Không tìm thấy đơn hàng." } });
      }

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ message: "Đơn hàng đã được xóa thành công." });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({ errors: { server: error.message } });
    }
  },

  // Cập nhật trạng thái đơn hàng
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
        return res
          .status(404)
          .json({ errors: { orderID: "Không tìm thấy đơn hàng." } });
      }

      res.status(200).json({
        message: "Trạng thái đơn hàng đã được cập nhật thành công.",
        order: updatedOrder,
      });
    } catch (error) {
      res.status(500).json({ errors: { server: error.message } });
    }
  },

  getOrdersByUserId: async (req, res) => {
    try {
      const { userID } = req.params;

      if (!userID) {
        return res.status(400).json({
          errors: { userID: "Vui lòng cung cấp mã người dùng." },
        });
      }

      const user = await User.findOne({ userID });
      if (!user) {
        return res.status(404).json({
          errors: { userID: "Không tìm thấy thông tin người dùng." },
        });
      }

      const orders = await Order.find({ userID }).populate("orderDetails");

      if (!orders || orders.length === 0) {
        return res.status(404).json({
          errors: { userID: "Không tìm thấy đơn hàng nào cho người dùng này." },
        });
      }

      res.status(200).json({
        user,
        orders,
      });
    } catch (error) {
      res.status(500).json({ errors: { server: error.message } });
    }
  },
};

module.exports = orderController;
