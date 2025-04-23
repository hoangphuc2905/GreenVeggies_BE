const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

/**
 * @swagger
 * tags:
 *   - name: Payment
 *     description: Các API liên quan đến đơn hàng
 */

/**
 * @swagger
 * /api/payments/create:
 *   post:
 *     summary: Tạo thanh toán
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
 *                 description: "Số tiền cần thanh toán"
 *                 example: 20000
 *               orderID:
 *                 type: string
 *                 description: "ID của đơn hàng"
 *                 example: "ORDER123"
 *               paymentMethod:
 *                 type: string
 *                 description: "Phương thức thanh toán (Bank Transfer hoặc Cash)"
 *                 example: "Bank Transfer"
 *     responses:
 *       200:
 *         description: Tạo thanh toán thành công
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       404:
 *         description: Không tìm thấy đơn hàng
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/create", paymentController.createPayment);

/**
 * @swagger
 * /api/payments/update-status:
 *   post:
 *     summary: Cập nhật trạng thái thanh toán
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
 *                 description: "ID của thanh toán"
 *                 example: "PM0008210425"
 *               newStatus:
 *                 type: string
 *                 description: "Trạng thái mới của thanh toán"
 *                 example: "Completed"
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thanh toán thành công
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/update-status", paymentController.updateStatus);

/**
 * @swagger
 * /api/payments/{orderID}:
 *   get:
 *     summary: Lấy thông tin thanh toán theo order ID
 *     tags: [Payment]
 *     parameters:
 *       - in: path
 *         name: orderID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của đơn hàng cần lấy thông tin thanh toán
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
 *                   example: Thống kê thanh toán theo order ID thành công.
 *                 stats:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 680708b9eb2366582d4c82dd
 *                     orderID:
 *                       type: string
 *                       example: HD0001000120250225190325
 *                     paymentMethod:
 *                       type: string
 *                       example: Bank Transfer
 *                     paymentStatus:
 *                       type: string
 *                       example: Pending
 *                     amount:
 *                       type: number
 *                       example: 20000
 *                     content:
 *                       type: string
 *                       example: TT829605
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-04-22T03:10:49.518+00:00
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-04-22T03:10:49.518+00:00
 *                     paymentID:
 *                       type: string
 *                       example: PM0001220425
 *                     __v:
 *                       type: integer
 *                       example: 0
 *       400:
 *         description: Lỗi do thiếu order ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: object
 *                   properties:
 *                     orderID:
 *                       type: string
 *                       example: Vui lòng cung cấp order ID để thống kê.
 *       500:
 *         description: Lỗi máy chủ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: object
 *                   properties:
 *                     server:
 *                       type: string
 *                       example: Lỗi khi lấy thông tin thanh toán.
 */
router.get("/:orderID", paymentController.getPaymentByOrderID);

module.exports = router;
