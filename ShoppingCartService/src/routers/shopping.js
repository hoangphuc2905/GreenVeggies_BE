const express = require("express");
const router = express.Router();
const shoppingCartController = require("../controllers/shoppingCartController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

/**
 * @swagger
 * tags:
 *   - name: ShoppingCarts
 *     description: API for managing shopping carts
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ShoppingCart:
 *       type: object
 *       required:
 *         - shoppingCartID
 *         - userID
 *         - items
 *         - totalPrice
 *       properties:
 *         shoppingCartID:
 *           type: string
 *           description: Auto-generated ID of the shopping cart
 *         userID:
 *           type: string
 *           description: ID of the user who owns the cart
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productID:
 *                 type: string
 *                 description: ID of the product
 *               quantity:
 *                 type: number
 *                 description: Quantity of the product
 *               price:
 *                 type: number
 *                 description: Price per unit of the product
 *               name:
 *                 type: string
 *                 description: Name of the product
 *               imageUrl:
 *                 type: string
 *                 description: Image URL of the product
 *         totalPrice:
 *           type: number
 *           description: Total price of all items in the cart
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update time
 *       example:
 *         shoppingCartID: "SCUSER000120250225-001"
 *         userID: "USER000120250225"
 *         items:
 *           - productID: "SP0001220425"
 *             quantity: 2
 *             price: 500
 *             name: "Táo 500ml"
 *             imageUrl: "https://example.com/image1.jpg"
 *         totalPrice: 1000
 *         createdAt: "2025-04-22T03:10:49.518Z"
 *         updatedAt: "2025-04-22T03:10:49.518Z"
 */

/**
 * @swagger
 * /api/shopping-carts:
 *   post:
 *     summary: Tạo hoặc cập nhật giỏ hàng
 *     tags: [ShoppingCarts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productID:
 *                       type: string
 *                       example: "SP0001220425"
 *                     quantity:
 *                       type: number
 *                       example: 2
 *                   required:
 *                     - productID
 *                     - quantity
 *     responses:
 *       201:
 *         description: Giỏ hàng được tạo hoặc cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 shoppingCart:
 *                   $ref: '#/components/schemas/ShoppingCart'
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       404:
 *         description: Không tìm thấy sản phẩm
 *       500:
 *         description: Lỗi máy chủ
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/",
  authMiddleware,
  shoppingCartController.createOrUpdateShoppingCart
);

/**
 * @swagger
 * /api/shopping-carts:
 *   get:
 *     summary: Lấy danh sách tất cả giỏ hàng (chỉ dành cho admin)
 *     tags: [ShoppingCarts]
 *     responses:
 *       200:
 *         description: Danh sách giỏ hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ShoppingCart'
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       403:
 *         description: Chỉ admin mới có quyền xem
 *       500:
 *         description: Lỗi máy chủ
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  shoppingCartController.getAllShoppingCarts
);

/**
 * @swagger
 * /api/shopping-carts/{shoppingCartID}:
 *   get:
 *     summary: Lấy thông tin giỏ hàng theo ID
 *     tags: [ShoppingCarts]
 *     parameters:
 *       - in: path
 *         name: shoppingCartID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của giỏ hàng
 *     responses:
 *       200:
 *         description: Thông tin giỏ hàng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShoppingCart'
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       403:
 *         description: Không có quyền xem giỏ hàng này
 *       404:
 *         description: Không tìm thấy giỏ hàng
 *       500:
 *         description: Lỗi máy chủ
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/:shoppingCartID",
  authMiddleware,
  shoppingCartController.getShoppingCartByID
);

/**
 * @swagger
 * /api/shopping-carts/user/{userID}:
 *   get:
 *     summary: Lấy giỏ hàng của người dùng
 *     tags: [ShoppingCarts]
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Thông tin giỏ hàng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShoppingCart'
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       403:
 *         description: Không có quyền xem giỏ hàng này
 *       404:
 *         description: Không tìm thấy giỏ hàng
 *       500:
 *         description: Lỗi máy chủ
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/user/:userID",
  authMiddleware,
  shoppingCartController.getShoppingCartByUserID
);

/**
 * @swagger
 * /api/shopping-carts/{shoppingCartID}:
 *   delete:
 *     summary: Xóa giỏ hàng theo ID
 *     tags: [ShoppingCarts]
 *     parameters:
 *       - in: path
 *         name: shoppingCartID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của giỏ hàng
 *     responses:
 *       200:
 *         description: Xóa giỏ hàng thành công
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
 *         description: Không có quyền xóa giỏ hàng này
 *       404:
 *         description: Không tìm thấy giỏ hàng
 *       500:
 *         description: Lỗi máy chủ
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/:shoppingCartID",
  authMiddleware,
  shoppingCartController.deleteShoppingCart
);

/**
 * @swagger
 * /api/shopping-carts/remove-item/{shoppingCartDetailID}:
 *   patch:
 *     summary: Xóa 1 sản phẩm khỏi giỏ hàng
 *     tags: [ShoppingCarts]
 *     parameters:
 *       - in: path
 *         name: shoppingCartDetailID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID chi tiết giỏ hàng cần xóa
 *     responses:
 *       200:
 *         description: Xóa sản phẩm khỏi giỏ hàng thành công
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
 *         description: Không có quyền xóa sản phẩm này
 *       404:
 *         description: Không tìm thấy giỏ hàng hoặc sản phẩm
 *       500:
 *         description: Lỗi máy chủ
 *     security:
 *       - bearerAuth: []
 */
router.patch(
  "/remove-item/:shoppingCartDetailID",
  authMiddleware,
  shoppingCartController.deleteShoppingCartDetail
);

/**
 * @swagger
 * /api/shopping-carts/update-quantity:
 *   patch:
 *     summary: Cập nhật số lượng sản phẩm trong giỏ hàng
 *     tags: [ShoppingCarts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shoppingCartID:
 *                 type: string
 *                 example: "SCUSER000120250225-001"
 *               productID:
 *                 type: string
 *                 example: "SP0001220425"
 *               quantity:
 *                 type: number
 *                 example: 3
 *             required:
 *               - shoppingCartID
 *               - productID
 *               - quantity
 *     responses:
 *       200:
 *         description: Cập nhật số lượng sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 shoppingCart:
 *                   $ref: '#/components/schemas/ShoppingCart'
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       403:
 *         description: Không có quyền cập nhật giỏ hàng này
 *       404:
 *         description: Không tìm thấy giỏ hàng hoặc sản phẩm
 *       500:
 *         description: Lỗi máy chủ
 *     security:
 *       - bearerAuth: []
 */
router.patch(
  "/update-quantity",
  authMiddleware,
  shoppingCartController.updateQuantity
);

module.exports = router;
