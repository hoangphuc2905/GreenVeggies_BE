const Notification = require("../models/Notification");

const notificationService = {
  // Tạo thông báo mới
  createNotification: async (data) => {
    try {
      const notification = new Notification(data);
      return await notification.save();
    } catch (error) {
      throw new Error(`Lỗi khi tạo thông báo: ${error.message}`);
    }
  },

  // Lấy danh sách thông báo theo receiverID
  getNotificationsByReceiver: async (receiverID) => {
    try {
      return await Notification.find({ receiverID }).sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách thông báo: ${error.message}`);
    }
  },

  // Lấy thông báo theo OrderID
  getNotificationsByOrderID: async (orderID) => {
  try {
    const notifications = await Notification.find({
      orderID,
      title: "Thông báo hủy đơn hàng", // Filter by title
    });

    // Extract only the "Lý do" part from the message
    return notifications.map((notification) => {
      const reasonIndex = notification.message.indexOf("Lý do:");
      const reason = reasonIndex !== -1 ? notification.message.substring(reasonIndex) : "";
      return {
        ...notification.toObject(),
        message: reason, // Replace the message with the extracted reason
      };
    });
  } catch (error) {
    throw new Error(`Lỗi khi lấy thông báo theo orderID: ${error.message}`);
  }
},

  // Đánh dấu thông báo là đã đọc
  markAsRead: async (notificationID) => {
    try {
      return await Notification.findByIdAndUpdate(
        notificationID,
        { isRead: true },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Lỗi khi đánh dấu thông báo là đã đọc: ${error.message}`);
    }
  },

  // Xóa thông báo
  deleteNotification: async (notificationID) => {
    try {
      return await Notification.findByIdAndDelete(notificationID);
    } catch (error) {
      throw new Error(`Lỗi khi xóa thông báo: ${error.message}`);
    }
  },
};

module.exports = notificationService;
