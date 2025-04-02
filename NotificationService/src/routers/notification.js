const express = require("express");
const notificationController = require("../controllers/notificationController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: API quản lý thông báo
 */

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Tạo thông báo mới
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               senderType:
 *                 type: string
 *                 enum: [user, admin, system]
 *                 description: Loại người gửi (user, admin, system)
 *               senderUserID:
 *                 type: string
 *                 description: ID của người gửi
 *               receiverID:
 *                 type: string
 *                 description: ID của người nhận
 *               title:
 *                 type: string
 *                 description: Tiêu đề thông báo
 *               message:
 *                 type: string
 *                 description: Nội dung thông báo
 *               type:
 *                 type: string
 *                 enum: [order, system, payment]
 *                 description: Loại thông báo
 *               orderID:
 *                 type: string
 *                 description: ID của đơn hàng (nếu có)
 *     responses:
 *       201:
 *         description: Thông báo đã được tạo thành công
 *       400:
 *         description: Lỗi yêu cầu không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/", notificationController.createNotification);

/**
 * @swagger
 * /api/notifications/{receiverID}:
 *   get:
 *     summary: Lấy danh sách thông báo theo receiverID
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: receiverID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của người nhận
 *     responses:
 *       200:
 *         description: Danh sách thông báo
 *       400:
 *         description: Lỗi yêu cầu không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/:receiverID", notificationController.getNotificationsByReceiver);

/**
 * @swagger
 * /api/notifications/{notificationID}/read:
 *   patch:
 *     summary: Đánh dấu thông báo là đã đọc
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: notificationID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của thông báo
 *     responses:
 *       200:
 *         description: Thông báo đã được đánh dấu là đã đọc
 *       400:
 *         description: Lỗi yêu cầu không hợp lệ
 *       404:
 *         description: Không tìm thấy thông báo
 *       500:
 *         description: Lỗi máy chủ
 */
router.patch("/:notificationID/read", notificationController.markAsRead);

/**
 * @swagger
 * /api/notifications/{notificationID}:
 *   delete:
 *     summary: Xóa thông báo
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: notificationID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của thông báo
 *     responses:
 *       200:
 *         description: Thông báo đã được xóa thành công
 *       400:
 *         description: Lỗi yêu cầu không hợp lệ
 *       404:
 *         description: Không tìm thấy thông báo
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete("/:notificationID", notificationController.deleteNotification);

module.exports = router;
