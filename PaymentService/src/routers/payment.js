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
 * /api/payments/create-qr:
 *   post:
 *     summary: Tạo mã QR thanh toán
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
 *     responses:
 *       200:
 *         description: Tạo mã QR thanh toán thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tạo mã QR thanh toán thành công.
 *                 qrURL:
 *                   type: string
 *                   description: URL của mã QR thanh toán
 *                   example: https://img.vietqr.io/image/MB-868629052003-compact2.png?amount=20000&addInfo=Thanh%20toan%20don%20hang&accountName=HUYNH%20HOANG%20PHUC&acqId=970422
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/create-qr", paymentController.createWithQR);

module.exports = router;
