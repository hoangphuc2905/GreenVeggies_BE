const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    senderType: {
      type: String,
      required: true,
      enum: ["user", "admin", "system"],
    },
    senderUserID: {
      type: String,
      ref: "User",
    },
    receiverID: {
      type: String,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["order", "system", "payment"],
    },
    orderID: {
      type: String,
      ref: "Order",
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
