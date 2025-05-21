const notificationService = require("../services/notificationService");

const notificationController = {
  // API: Tạo thông báo mới
  createNotification: async (req, res) => {
    try {
      const {
        senderType,
        senderUserID,
        receiverID,
        title,
        message,
        type,
        orderID,
      } = req.body;

      // Kiểm tra các trường bắt buộc
      if (!senderType || !receiverID || !title || !message || !type) {
        return res.status(400).json({
          errors: "Vui lòng cung cấp đầy đủ thông tin thông báo.",
        });
      }

      const notificationData = {
        senderType,
        senderUserID,
        receiverID,
        title,
        message,
        type,
        orderID: orderID || null,
      };

      const notification = await notificationService.createNotification(
        notificationData
      );
      res.status(201).json({
        message: "Thông báo đã được tạo thành công.",
        notification,
      });
    } catch (error) {
      res.status(500).json({
        errors: `Lỗi khi tạo thông báo: ${error.message}`,
      });
    }
  },

  // API: Lấy danh sách thông báo theo receiverID
  getNotificationsByReceiver: async (req, res) => {
    try {
      const { receiverID } = req.params;

      if (!receiverID) {
        return res.status(400).json({
          errors: "Vui lòng cung cấp receiverID.",
        });
      }

      const notifications =
        await notificationService.getNotificationsByReceiver(receiverID);
      res.status(200).json(notifications); // luôn trả về 200, kể cả mảng rỗng
    } catch (error) {
      res.status(500).json({
        errors: `Lỗi khi lấy danh sách thông báo: ${error.message}`,
      });
    }
  },

  getNotificationsByOrderID: async (req, res) => {
    try {
      const { orderID } = req.params;

      if (!orderID) {
        return res.status(400).json({
          errors: "Vui lòng cung cấp orderID.",
        });
      }

      const notifications = await notificationService.getNotificationsByOrderID(
        orderID
      );

      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({
        errors: `Lỗi khi lấy danh sách thông báo theo orderID: ${error.message}`,
      });
    }
  },

  // API: Đánh dấu thông báo là đã đọc
  markAsRead: async (req, res) => {
    try {
      const { notificationID } = req.params;

      if (!notificationID) {
        return res.status(400).json({
          errors: "Vui lòng cung cấp notificationID.",
        });
      }

      const updatedNotification = await notificationService.markAsRead(
        notificationID
      );
      if (!updatedNotification) {
        return res.status(404).json({
          errors: "Không tìm thấy thông báo.",
        });
      }

      res.status(200).json({
        message: "Thông báo đã được đánh dấu là đã đọc.",
        notification: updatedNotification,
      });
    } catch (error) {
      res.status(500).json({
        errors: `Lỗi khi đánh dấu thông báo là đã đọc: ${error.message}`,
      });
    }
  },

  // API: Xóa thông báo
  deleteNotification: async (req, res) => {
    try {
      const { notificationID } = req.params;

      if (!notificationID) {
        return res.status(400).json({
          errors: "Vui lòng cung cấp notificationID.",
        });
      }

      const deletedNotification = await notificationService.deleteNotification(
        notificationID
      );
      if (!deletedNotification) {
        return res.status(404).json({
          errors: "Không tìm thấy thông báo.",
        });
      }

      res.status(200).json({
        message: "Thông báo đã được xóa thành công.",
      });
    } catch (error) {
      res.status(500).json({
        errors: `Lỗi khi xóa thông báo: ${error.message}`,
      });
    }
  },
};

module.exports = notificationController;
