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
 *     summary: Tạo hoặc cập nhật giỏ hàng mới
 *     tags: [ShoppingCarts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userID:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productID:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     price:
 *                       type: number
 *                     description:
 *                       type: string
 *                     imageUrl:
 *                       type: string
 *               totalPrice:
 *                 type: number
 *     responses:
 *       201:
 *         description: Giỏ hàng được tạo hoặc cập nhật thành công
 *       400:
 *         description: Yêu cầu không hợp lệ
 */
router.post("/", shoppingCartController.createOrUpdateShoppingCart);

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
 *                   userID:
 *                     type: string
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         productID:
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
 * /api/shopping-carts/{shoppingCartID}:
 *   get:
 *     summary: Tìm kiếm giỏ hàng theo shoppingCartID
 *     tags: [ShoppingCarts]
 *     parameters:
 *       - in: path
 *         name: shoppingCartID
 *         required: true
 *         schema:
 *           type: string
 *         description: shoppingCartID của giỏ hàng cần tìm kiếm
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
 *                 userID:
 *                   type: string
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productID:
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
router.get("/:shoppingCartID", shoppingCartController.getShoppingCartByID);

/**
 * @swagger
 * /api/shopping-carts/user/{userID}:
 *   get:
 *     summary: Tìm kiếm giỏ hàng theo userID
 *     tags: [ShoppingCarts]
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         schema:
 *           type: string
 *         description: userID của giỏ hàng cần tìm kiếm
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
 *                 userID:
 *                   type: string
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productID:
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
router.get("/user/:userID", shoppingCartController.getShoppingCartByUserID);

/**
 * @swagger
 * /api/shopping-carts/{shoppingCartID}:
 *   delete:
 *     summary: Xóa giỏ hàng theo shoppingCartID
 *     tags: [ShoppingCarts]
 *     parameters:
 *       - in: path
 *         name: shoppingCartID
 *         required: true
 *         schema:
 *           type: string
 *         description: shoppingCartID của giỏ hàng cần xóa
 *     responses:
 *       200:
 *         description: Giỏ hàng được xóa thành công
 *       404:
 *         description: Không tìm thấy giỏ hàng
 */
router.delete("/:shoppingCartID", shoppingCartController.deleteShoppingCart);

/**
 * @swagger
 * /api/shopping-carts/shopping-cart-details/{shoppingCartDetailID}:
 *   delete:
 *     summary: Xóa chi tiết giỏ hàng theo shoppingCartDetailID
 *     tags: [ShoppingCarts]
 *     parameters:
 *       - in: path
 *         name: shoppingCartDetailID
 *         required: true
 *         schema:
 *           type: string
 *         description: shoppingCartDetailID của chi tiết giỏ hàng cần xóa
 *     responses:
 *       200:
 *         description: Chi tiết giỏ hàng được xóa thành công
 *       404:
 *         description: Không tìm thấy chi tiết giỏ hàng
 */
router.delete(
    "/shopping-cart-details/:shoppingCartDetailID",
  shoppingCartController.deleteShoppingCartDetail
);

module.exports = router;
