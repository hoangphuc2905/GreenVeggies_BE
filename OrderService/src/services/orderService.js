const Order = require("../models/Order");
const OrderDetail = require("../models/OrderDetails");

exports.createOrder = async (orderData) => {
  const order = new Order(orderData);
  return await order.save();
};

exports.getAllOrders = async () => {
  return await Order.find()
    .populate("userID")
    .populate("orderDetails")
    // .populate("paymentMethod");
};

exports.getOrderById = async (orderID) => {
  return await Order.findOne({ orderID })
    .populate("userID")
    .populate("orderDetails")
    // .populate("paymentMethod");
};

exports.updateOrder = async (orderID, orderData) => {
  return await Order.findByIdAndUpdate(orderID, orderData, {
    new: true,
    runValidators: true,
  });
};

exports.deleteOrder = async (orderID) => {
  await OrderDetail.deleteMany({ orderID });

  return await Order.findByIdAndDelete(orderID);
};
