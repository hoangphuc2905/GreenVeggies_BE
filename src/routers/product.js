const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Các API liên quan đến sản phẩm
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Lấy danh sách tất cả sản phẩm
 *     tags: [Products]
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
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   price:
 *                     type: number
 *                   quantity:
 *                     type: number
 *                   category:
 *                     type: string
 *                   imageUrl:
 *                     type: string
 */
router.get("/", productController.getAllProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Tạo sản phẩm mới
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - quantity
 *               - import
 *               - category
 *               - origin
 *               - imageUrl
 *               - unit
 *               - status
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               sold:
 *                 type: number
 *                 default: 0
 *               quantity:
 *                 type: number
 *               import:
 *                 type: number
 *               category:
 *                 type: string
 *               origin:
 *                 type: string
 *               imageUrl:
 *                 type: array
 *                 items:
 *                   type: string
 *               unit:
 *                 type: string
 *                 enum: [piece, kg, gram, liter, ml]
 *               status:
 *                 type: string
 *                 enum: [available, unavailable, out_of_stock]
 *                 default: available
 *     responses:
 *       201:
 *         description: Sản phẩm được tạo thành công
 *       400:
 *         description: Yêu cầu không hợp lệ
 */
router.post("/", productController.createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Cập nhật thông tin sản phẩm theo ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: description
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: price
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: quantity
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *        - in: query
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: imageUrl
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sản phẩm được cập nhật thành công
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.put("/:id", productController.updateProduct);

module.exports = router;
