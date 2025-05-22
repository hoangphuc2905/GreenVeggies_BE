const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Các API liên quan đến đơn hàng
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         orderID:
 *           type: string
 *           description: Mã đơn hàng (tự động sinh)
 *         userID:
 *           type: string
 *           description: ID của người dùng đặt hàng
 *         orderDetails:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productID:
 *                 type: string
 *                 description: ID của sản phẩm
 *               quantity:
 *                 type: number
 *                 description: Số lượng sản phẩm
 *               totalAmount:
 *                 type: number
 *                 description: Tổng tiền cho sản phẩm này
 *         totalQuantity:
 *           type: number
 *           description: Tổng số lượng sản phẩm trong đơn hàng
 *         totalAmount:
 *           type: number
 *           description: Tổng số tiền của đơn hàng
 *         address:
 *           type: string
 *           description: Địa chỉ giao hàng
 *         paymentMethod:
 *           type: string
 *           description: Phương thức thanh toán
 *         status:
 *           type: string
 *           enum: ["Pending", "Shipped", "Delivered", "Cancelled"]
 *           description: Trạng thái đơn hàng
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian tạo đơn hàng
 *       required:
 *         - userID
 *         - orderDetails
 *         - totalQuantity
 *         - totalAmount
 *         - address
 *         - paymentMethod
 *         - status
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
 *                 description: ID của người dùng
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
 *             required:
 *               - userID
 *               - orderDetails
 *               - totalQuantity
 *               - totalAmount
 *               - address
 *               - paymentMethod
 *     responses:
 *       201:
 *         description: Đơn hàng được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       403:
 *         description: Không có quyền tạo đơn hàng cho người dùng này
 *       500:
 *         description: Lỗi máy chủ
 *     security:
 *       - bearerAuth: []
 */
router.post("/", authMiddleware, orderController.createOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Lấy danh sách tất cả đơn hàng (chỉ dành cho admin)
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Danh sách tất cả đơn hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       403:
 *         description: Chỉ admin mới có quyền truy cập
 *       500:
 *         description: Lỗi máy chủ
 *     security:
 *       - bearerAuth: []
 */
router.get("/", authMiddleware, adminMiddleware, orderController.getAllOrders);

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
 *         description: Mã đơn hàng
 *     responses:
 *       200:
 *         description: Thông tin đơn hàng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       403:
 *         description: Không có quyền xem đơn hàng này
 *       404:
 *         description: Không tìm thấy đơn hàng
 *       500:
 *         description: Lỗi máy chủ
 *     security:
 *       - bearerAuth: []
 */
router.get("/:orderID", authMiddleware, orderController.getOrderById);

/**
 * @swagger
 * /api/orders/{orderID}:
 *   put:
 *     summary: Cập nhật trạng thái đơn hàng
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã đơn hàng
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
 *                 description: Trạng thái mới
 *             required:
 *               - status
 *     responses:
 *       200:
 *         description: Đơn hàng được cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       403:
 *         description: Chỉ admin mới có quyền cập nhật
 *       404:
 *         description: Không tìm thấy đơn hàng
 *       500:
 *         description: Lỗi máy chủ
 *     security:
 *       - bearerAuth: []
 */
router.put(
  "/:orderID",
  authMiddleware,
  orderController.updateOrder
);

/**
 * @swagger
 * /api/orders/user/{userID}:
 *   get:
 *     summary: Lấy danh sách đơn hàng của một người dùng
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
 *         description: Danh sách đơn hàng của người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: Thông tin người dùng
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       403:
 *         description: Không có quyền xem đơn hàng của người dùng này
 *       404:
 *         description: Không tìm thấy đơn hàng hoặc người dùng
 *       500:
 *         description: Lỗi máy chủ
 *     security:
 *       - bearerAuth: []
 */
router.get("/user/:userID", authMiddleware, orderController.getOrdersByUserId);

/**
 * @swagger
 * /api/orders/{orderID}:
 *   delete:
 *     summary: Xóa đơn hàng (chỉ dành cho admin)
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã đơn hàng
 *     responses:
 *       200:
 *         description: Đơn hàng đã được xóa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       403:
 *         description: Chỉ admin mới có quyền xóa
 *       404:
 *         description: Không tìm thấy đơn hàng
 *       500:
 *         description: Lỗi máy chủ
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/:orderID",
  authMiddleware,
  adminMiddleware,
  orderController.deleteOrder
);

module.exports = router;
