const Order = require("../models/Order");

exports.createOrder = async (orderData) => {
  const order = new Order(orderData);
  return await order.save();
};

exports.getAllOrders = async () => {
  return await Order.find().populate("userID productID paymentMethod");
};

exports.getOrderById = async (id) => {
  return await Order.findById(id).populate("userID productID paymentMethod");
};

exports.updateOrder = async (id, orderData) => {
  return await Order.findByIdAndUpdate(id, orderData, {
    new: true,
    runValidators: true,
  });
};

exports.deleteOrder = async (id) => {
  return await Order.findByIdAndDelete(id);
};
