const Order = require("../models/Order");
const OrderDetail = require("../models/OrderDetails");
const Product = require("../models/Product");
const User = require("../models/User");

exports.createOrder = async (orderData) => {
  const order = new Order(orderData);
  return await order.save();
};

exports.getAllOrders = async () => {
  return await Order.find().populate("userID").populate("orderDetails");
  // .populate("paymentMethod");
};

exports.getOrderById = async (orderID) => {
  return await Order.findOne({ orderID })
    .populate("userID")
    .populate("orderDetails");
  // .populate("paymentMethod");
};

exports.updateOrder = async (orderID, orderData) => {
  return await Order.findByIdAndUpdate(orderID, orderData, {
    new: true,
    runValidators: true,
  });
};

exports.getOrdersByUserId = async (userID) => {
  console.log("Tìm kiếm đơn hàng cho userID:", userID);

  const orders = await Order.find({ userID })
    .populate({
      path: "userID",
      model: "User",
      match: { userID },
      select: "username email phone",
    })
    .populate("orderDetails")
    .populate({
      path: "orderDetails.productID",
      model: "Product",
    });

  console.log("Kết quả tìm kiếm đơn hàng:", orders);

  return orders;
};

exports.deleteOrder = async (orderID) => {
  await OrderDetail.deleteMany({ orderID });

  return await Order.findByIdAndDelete(orderID);
};
