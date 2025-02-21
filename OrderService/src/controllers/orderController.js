const Order = require("../models/Order");
const Product = require("../models/Product");

// Create a new order
exports.createOrder = async (req, res) => {
  const session = await Order.startSession();
  session.startTransaction();
  try {
    const { productID, quantity } = req.body;

    // Tìm sản phẩm và kiểm tra số lượng
    const product = await Product.findById(productID).session(session);
    if (!product) {
      throw new Error("Product not found");
    }
    if (product.quantity < quantity) {
      throw new Error("Not enough products in stock");
    }

    // Tạo đơn hàng
    const order = new Order(req.body);
    await order.save({ session });

    // Trừ số lượng sản phẩm
    product.quantity -= quantity;
    await product.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(order);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ error: error.message });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate(
      "userID productID paymentMethod"
    );
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "userID productID paymentMethod"
    );
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update order
exports.updateOrder = async (req, res) => {
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
};
