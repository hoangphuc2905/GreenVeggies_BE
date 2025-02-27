const express = require("express");
const shoppingCartController = require("../controllers/shoppingCartController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: ShoppingCarts
 *     description: Các API liên quan đến giỏ hàng
 */

/**
 * @swagger
 * /api/shopping-carts:
 *   post:
 *     summary: Tạo giỏ hàng mới
 *     tags: [ShoppingCarts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     price:
 *                       type: number
 *                     imageUrl:
 *                       type: string
 *               totalPrice:
 *                 type: number
 *     responses:
 *       201:
 *         description: Giỏ hàng được tạo thành công
 *       400:
 *         description: Yêu cầu không hợp lệ
 */
router.post("/", shoppingCartController.createShoppingCart);

/**
 * @swagger
 * /api/shopping-carts:
 *   get:
 *     summary: Lấy danh sách tất cả giỏ hàng
 *     tags: [ShoppingCarts]
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
 *                   userId:
 *                     type: string
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         productId:
 *                           type: string
 *                         quantity:
 *                           type: number
 *                         price:
 *                           type: number
 *                         imageUrl:
 *                           type: string
 *                   totalPrice:
 *                     type: number
 *       400:
 *         description: Yêu cầu không hợp lệ
 */
router.get("/", shoppingCartController.getAllShoppingCarts);

/**
 * @swagger
 * /api/shopping-carts/{id}:
 *   get:
 *     summary: Tìm kiếm giỏ hàng theo ID
 *     tags: [ShoppingCarts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của giỏ hàng cần tìm kiếm
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
 *                 userId:
 *                   type: string
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: string
 *                       quantity:
 *                         type: number
 *                       price:
 *                         type: number
 *                       imageUrl:
 *                         type: string
 *                 totalPrice:
 *                   type: number
 *       404:
 *         description: Không tìm thấy giỏ hàng
 */
router.get("/:id", shoppingCartController.getShoppingCartById);

/**
 * @swagger
 * /api/shopping-carts/{id}:
 *   put:
 *     summary: Cập nhật thông tin giỏ hàng theo ID
 *     tags: [ShoppingCarts]
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
 *               userId:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     price:
 *                       type: number
 *                     imageUrl:
 *                       type: string
 *               totalPrice:
 *                 type: number
 *     responses:
 *       200:
 *         description: Giỏ hàng được cập nhật thành công
 *       404:
 *         description: Không tìm thấy giỏ hàng
 */
router.put("/:id", shoppingCartController.updateShoppingCart);

/**
 * @swagger
 * /api/shopping-carts/{id}:
 *   delete:
 *     summary: Xóa giỏ hàng theo ID
 *     tags: [ShoppingCarts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của giỏ hàng cần xóa
 *     responses:
 *       200:
 *         description: Giỏ hàng được xóa thành công
 *       404:
 *         description: Không tìm thấy giỏ hàng
 */
router.delete("/:id", shoppingCartController.deleteShoppingCart);

module.exports = router;
