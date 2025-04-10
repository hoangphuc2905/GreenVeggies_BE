const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Các API liên quan đến đơn hàng
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Tạo đơn hàng mới
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userID:
 *                 type: string
 *               orderDetails:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productID:
 *                       type: string
 *                     quantity:
 *                       type: number
 *               totalQuantity:
 *                 type: number
 *               totalAmount:
 *                 type: number
 *               address:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *     responses:
 *       201:
 *         description: Đơn hàng được tạo thành công
 *       400:
 *         description: Yêu cầu không hợp lệ
 */
router.post("/", orderController.createOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Lấy danh sách tất cả đơn hàng
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get("/", orderController.getAllOrders);

/**
 * @swagger
 * /api/orders/{orderID}:
 *   get:
 *     summary: Lấy thông tin đơn hàng theo ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đơn hàng
 *     responses:
 *       200:
 *         description: Thành công
 *       404:
 *         description: Không tìm thấy đơn hàng
 */
router.get("/:orderID", orderController.getOrderById);

/**
 * @swagger
 * /api/orders/{orderID}:
 *   put:
 *     summary: Cập nhật thông tin đơn hàng
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đơn hàng cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ["Pending", "Shipped", "Delivered", "Cancelled"]
 *     responses:
 *       200:
 *         description: Đơn hàng được cập nhật thành công
 *       404:
 *         description: Không tìm thấy đơn hàng
 */
router.put("/:orderID", orderController.updateOrder);

/**
 * @swagger
 * /api/orders/user/{userID}:
 *   get:
 *     summary: Lấy danh sách tất cả đơn hàng của một người dùng
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Thành công
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       404:
 *         description: Không tìm thấy đơn hàng
 */
router.get("/user/:userID", orderController.getOrdersByUserId);

module.exports = router;
