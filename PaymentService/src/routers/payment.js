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

module.exports = router;
