const express = require("express");
const productController = require("../controllers/productController");
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - productID
 *         - name
 *         - description
 *         - price
 *         - quantity
 *         - category
 *         - origin
 *         - unit
 *       properties:
 *         productID:
 *           type: string
 *           description: Auto-generated ID of the product
 *         name:
 *           type: string
 *           description: Name of the product
 *         description:
 *           type: string
 *           description: Description of the product
 *         price:
 *           type: number
 *           description: Price of the product
 *         quantity:
 *           type: number
 *           description: Quantity of the product
 *         category:
 *           type: string
 *           description: Category ID of the product
 *         origin:
 *           type: string
 *           description: Origin of the product
 *         unit:
 *           type: string
 *           description: Unit of the product
 *         imageUrl:
 *           type: array
 *           items:
 *             type: string
 *           description: Image URLs of the product
 *       example:
 *         productID: "SP0001"
 *         name: "Táo 500ml"
 *         description: "Táo"
 *         price: 1111
 *         quantity: 2070
 *         category: "CATE0001"
 *         origin: "Việt Nam"
 *         unit: "kg"
 *         imageUrl: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 */

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: API for managing products
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
 * /api/products/{productID}:
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
router.put("/:productID", productController.updateProduct);

/**
 * @swagger
 * /api/products/category/{categoryID}:
 *   get:
 *     summary: Get all products by category
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: categoryID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the category
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request
 */
router.get("/category/:categoryID", productController.getProductsByCategory);

/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Search products by name
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         required: true
 *         description: Keyword to search for products
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request
 */
router.get("/search", productController.searchProductbyName);

module.exports = router;
