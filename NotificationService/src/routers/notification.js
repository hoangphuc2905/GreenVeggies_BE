const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: API quản lý thông báo
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         senderType:
 *           type: string
 *           enum: [user, admin, system]
 *           description: Loại người gửi (user, admin, system)
 *         senderUserID:
 *           type: string
 *           description: ID của người gửi
 *         receiverID:
 *           type: string
 *           description: ID của người nhận
 *         title:
 *           type: string
 *           description: Tiêu đề thông báo
 *         message:
 *           type: string
 *           description: Nội dung thông báo
 *         type:
 *           type: string
 *           enum: [order, system, payment]
 *           description: Loại thông báo
 *         orderID:
 *           type: string
 *           description: ID của đơn hàng (nếu có)
 *         isRead:
 *           type: boolean
 *           description: Trạng thái đã đọc của thông báo
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian tạo thông báo
 *       required:
 *         - senderType
 *         - senderUserID
 *         - receiverID
 *         - title
 *         - message
 *         - type
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
 *             $ref: '#/components/schemas/Notification'
 *     responses:
 *       201:
 *         description: Thông báo đã được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Thông báo thành công
 *                 notification:
 *                   $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       403:
 *         description: Chỉ admin được tạo thông báo với senderType là admin hoặc system
 *       500:
 *         description: Lỗi máy chủ
 *     security:
 *       - bearerAuth: []
 */
router.post("/", authMiddleware, notificationController.createNotification);

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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       403:
 *         description: Không có quyền xem thông báo của người dùng này
 *       500:
 *         description: Lỗi máy chủ
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/:receiverID",
  authMiddleware,
  notificationController.getNotificationsByReceiver
);

/**
 * @swagger
 * /api/notifications/order/{orderID}:
 *   get:
 *     summary: Lấy danh sách thông báo theo orderID với tile là "Thông báo hủy đơn hàng"
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: orderID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của đơn hàng
 *     responses:
 *       200:
 *         description: Danh sách thông báo liên quan đến orderID
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Yêu cầu không hợp lệ (thiếu orderID)
 *       404:
 *         description: Không tìm thấy thông báo liên quan đến orderID
 *       500:
 *         description: Lỗi máy chủ
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/order/:orderID",
  authMiddleware,
  notificationController.getNotificationsByOrderID
);

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Thông báo thành công
 *                 notification:
 *                   $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       403:
 *         description: Không có quyền đánh dấu thông báo này
 *       404:
 *         description: Không tìm thấy thông báo
 *       500:
 *         description: Lỗi máy chủ
 *     security:
 *       - bearerAuth: []
 */
router.patch(
  "/:notificationID/read",
  authMiddleware,
  notificationController.markAsRead
);

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Thông báo thành công
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       403:
 *         description: Không có quyền xóa thông báo này
 *       404:
 *         description: Không tìm thấy thông báo
 *       500:
 *         description: Lỗi máy chủ
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/:notificationID",
  authMiddleware,
  notificationController.deleteNotification
);

module.exports = router;
