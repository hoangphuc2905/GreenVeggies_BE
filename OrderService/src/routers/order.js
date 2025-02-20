const express = require("express");
const orderController = require("../controllers/orderController");

const router = express.Router();

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
 *               orderID:
 *                 type: string
 *               userID:
 *                 type: string
 *               productID:
 *                 type: string
 *               quantity:
 *                 type: number
 *               totalAmount:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: ["Pending", "Shipped", "Delivered", "Cancelled"]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   orderID:
 *                     type: string
 *                   userID:
 *                     type: string
 *                   productID:
 *                     type: string
 *                   quantity:
 *                     type: number
 *                   totalAmount:
 *                     type: number
 *                   status:
 *                     type: string
 *                   paymentMethod:
 *                     type: string
 *       400:
 *         description: Yêu cầu không hợp lệ
 */
router.get("/", orderController.getAllOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Tìm kiếm đơn hàng theo ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đơn hàng cần tìm kiếm
 *     responses:
 *       200:
 *         description: Tìm kiếm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 orderID:
 *                   type: string
 *                 userID:
 *                   type: string
 *                 productID:
 *                   type: string
 *                 quantity:
 *                   type: number
 *                 totalAmount:
 *                   type: number
 *                 status:
 *                   type: string
 *                 paymentMethod:
 *                   type: string
 *       404:
 *         description: Không tìm thấy đơn hàng
 */
router.get("/:id", orderController.getOrderById);

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Cập nhật thông tin đơn hàng theo ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderID:
 *                 type: string
 *               userID:
 *                 type: string
 *               productID:
 *                 type: string
 *               quantity:
 *                 type: number
 *               totalAmount:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: ["Pending", "Shipped", "Delivered", "Cancelled"]
 *               paymentMethod:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đơn hàng được cập nhật thành công
 *       404:
 *         description: Không tìm thấy đơn hàng
 */
router.put("/:id", orderController.updateOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Xóa đơn hàng theo ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Đơn hàng được xóa thành công
 *       404:
 *         description: Không tìm thấy đơn hàng
 */
router.delete("/:id", orderController.deleteOrder);

module.exports = router;
