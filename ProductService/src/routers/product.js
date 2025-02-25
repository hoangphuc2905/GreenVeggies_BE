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
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Tên sản phẩm
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         required: true
 *         description: Mô tả sản phẩm
 *       - in: query
 *         name: price
 *         schema:
 *           type: number
 *         required: true
 *         description: Giá sản phẩm
 *       - in: query
 *         name: sold
 *         schema:
 *           type: number
 *           default: 0
 *         description: Số lượng đã bán
 *       - in: query
 *         name: quantity
 *         schema:
 *           type: number
 *         required: true
 *         description: Số lượng tồn kho
 *       - in: query
 *         name: import
 *         schema:
 *           type: number
 *         required: true
 *         description: Số lượng nhập vào
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: true
 *         description: Danh mục sản phẩm
 *       - in: query
 *         name: origin
 *         schema:
 *           type: string
 *         required: true
 *         description: Xuất xứ sản phẩm
 *       - in: query
 *         name: imageUrl
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         required: true
 *         description: Danh sách URL hình ảnh sản phẩm
 *       - in: query
 *         name: unit
 *         schema:
 *           type: string
 *           enum: [piece, kg, gram, liter, ml]
 *         required: true
 *         description: Đơn vị đo lường
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [available, unavailable, out_of_stock]
 *           default: available
 *         required: true
 *         description: Trạng thái sản phẩm
 *     responses:
 *       201:
 *         description: Sản phẩm được tạo thành công
 *       400:
 *         description: Yêu cầu không hợp lệ
 */
router.post("/", productController.createProduct);

/**
 * @swagger
 * /api/products/{productID}:
 *   get:
 *     summary: Tìm kiếm sản phẩm theo ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm cần tìm kiếm
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
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                 quantity:
 *                   type: number
 *                 category:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.get("/:productID", productController.getProductById);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Cập nhật thông tin sản phẩm theo ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: productID
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: name
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: description
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: price
 *         required: false
 *         schema:
 *           type: number
 *       - in: query
 *         name: quantity
 *         required: false
 *         schema:
 *           type: number
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: imageUrl
 *         required: false
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
