const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

/**
 * @swagger
 * tags:
 *   - name: Payment
 *     description: Các API liên quan đến thanh toán
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       properties:
 *         paymentID:
 *           type: string
 *           description: Mã thanh toán (tự động sinh)
 *         orderID:
 *           type: string
 *           description: ID của đơn hàng liên quan
 *         amount:
 *           type: number
 *           description: Số tiền thanh toán
 *         paymentMethod:
 *           type: string
 *           enum: ["Bank Transfer", "Cash"]
 *           description: Phương thức thanh toán
 *         paymentStatus:
 *           type: string
 *           enum: ["Pending", "Completed", "Failed"]
 *           description: Trạng thái thanh toán
 *         content:
 *           type: string
 *           description: Nội dung thanh toán (nếu có)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian tạo thanh toán
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian cập nhật thanh toán
 *       required:
 *         - paymentID
 *         - orderID
 *         - amount
 *         - paymentMethod
 *         - paymentStatus
 */

/**
 * @swagger
 * /api/payments/create:
 *   post:
 *     summary: Tạo thanh toán mới
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Số tiền cần thanh toán
 *                 example: 20000
 *               orderID:
 *                 type: string
 *                 description: ID của đơn hàng
 *                 example: "HD0001000120250225190325"
 *               paymentMethod:
 *                 type: string
 *                 enum: ["Bank Transfer", "Cash"]
 *                 description: Phương thức thanh toán
 *                 example: "Bank Transfer"
 *               content:
 *                 type: string
 *                 description: Nội dung thanh toán (tùy chọn)
 *                 example: "TT829605"
 *             required:
 *               - amount
 *               - orderID
 *               - paymentMethod
 *     responses:
 *       201:
 *         description: Tạo thanh toán thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 payment:
 *                   $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       403:
 *         description: Không có quyền tạo thanh toán cho đơn hàng này
 *       404:
 *         description: Không tìm thấy đơn hàng
 *       500:
 *         description: Lỗi máy chủ
 *     security:
 *       - bearerAuth: []
 */
router.post("/create", authMiddleware, paymentController.createPayment);

/**
 * @swagger
 * /api/payments/update-status:
 *   post:
 *     summary: Cập nhật trạng thái thanh toán (chỉ dành cho admin)
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentID:
 *                 type: string
 *                 description: ID của thanh toán
 *                 example: "PM0001220425"
 *               newStatus:
 *                 type: string
 *                 enum: ["Pending", "Completed", "Failed"]
 *                 description: Trạng thái mới của thanh toán
 *                 example: "Completed"
 *             required:
 *               - paymentID
 *               - newStatus
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thanh toán thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 payment:
 *                   $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       403:
 *         description: Chỉ admin mới có quyền cập nhật
 *       404:
 *         description: Không tìm thấy thanh toán
 *       500:
 *         description: Lỗi máy chủ
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/update-status",
  authMiddleware,
  adminMiddleware,
  paymentController.updateStatus
);

/**
 * @swagger
 * /api/payments/{orderID}:
 *   get:
 *     summary: Lấy thông tin thanh toán theo orderID
 *     tags: [Payment]
 *     parameters:
 *       - in: path
 *         name: orderID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của đơn hàng
 *     responses:
 *       200:
 *         description: Lấy thông tin thanh toán thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 payment:
 *                   $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       403:
 *         description: Không có quyền xem thanh toán này
 *       404:
 *         description: Không tìm thấy thanh toán hoặc đơn hàng
 *       500:
 *         description: Lỗi máy chủ
 *     security:
 *       - bearerAuth: []
 */
router.get("/:orderID", authMiddleware, paymentController.getPaymentByOrderID);

module.exports = router;
