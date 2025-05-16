const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: API for managing products
 */

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
 *           description: Quantity in stock
 *         category:
 *           type: string
 *           description: Category ID of the product
 *         origin:
 *           type: string
 *           description: Origin of the product
 *         unit:
 *           type: string
 *           enum: ["piece", "kg", "gram", "liter", "ml"]
 *           description: Unit of measurement
 *         imageUrl:
 *           type: array
 *           items:
 *             type: string
 *           description: Image URLs of the product
 *         sold:
 *           type: number
 *           description: Number of products sold
 *           default: 0
 *         status:
 *           type: string
 *           enum: ["available", "unavailable", "out_of_stock"]
 *           description: Product status
 *           default: "available"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update time
 *       example:
 *         productID: "SP0001220425"
 *         name: "Táo 500ml"
 *         description: "Táo tươi nhập từ Đà Lạt"
 *         price: 1111
 *         quantity: 2070
 *         category: "CATE0001220425"
 *         origin: "Việt Nam"
 *         unit: "kg"
 *         imageUrl: ["https://example.com/image1.jpg"]
 *         sold: 0
 *         status: "available"
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Lấy danh sách tất cả sản phẩm
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/", productController.getAllProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Tạo sản phẩm mới (chỉ dành cho admin)
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Táo 500ml"
 *               description:
 *                 type: string
 *                 example: "Táo tươi nhập từ Đà Lạt"
 *               price:
 *                 type: number
 *                 example: 1111
 *               quantity:
 *                 type: number
 *                 example: 2070
 *               category:
 *                 type: string
 *                 example: "CATE0001220425"
 *               origin:
 *                 type: string
 *                 example: "Việt Nam"
 *               unit:
 *                 type: string
 *                 enum: ["piece", "kg", "gram", "liter", "ml"]
 *                 example: "kg"
 *               imageUrl:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["https://example.com/image1.jpg"]
 *             required:
 *               - name
 *               - description
 *               - price
 *               - quantity
 *               - category
 *               - origin
 *               - unit
 *     responses:
 *       201:
 *         description: Sản phẩm được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       403:
 *         description: Chỉ admin mới có quyền tạo
 *       500:
 *         description: Lỗi máy chủ
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  productController.createProduct
);

/**
 * @swagger
 * /api/products/{productID}:
 *   get:
 *     summary: Lấy thông tin sản phẩm theo ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm
 *     responses:
 *       200:
 *         description: Thông tin sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Không tìm thấy sản phẩm
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/:productID", productController.getProductById);

/**
 * @swagger
 * /api/products/{productID}:
 *   put:
 *     summary: Cập nhật sản phẩm theo ID (chỉ dành cho admin)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Táo 500ml"
 *               description:
 *                 type: string
 *                 example: "Táo tươi nhập từ Đà Lạt"
 *               price:
 *                 type: number
 *                 example: 1111
 *               quantity:
 *                 type: number
 *                 example: 2070
 *               category:
 *                 type: string
 *                 example: "CATE0001220425"
 *               origin:
 *                 type: string
 *                 example: "Việt Nam"
 *               unit:
 *                 type: string
 *                 enum: ["piece", "kg", "gram", "liter", "ml"]
 *                 example: "kg"
 *               imageUrl:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["https://example.com/image1.jpg"]
 *     responses:
 *       200:
 *         description: Sản phẩm được cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       403:
 *         description: Chỉ admin mới có quyền cập nhật
 *       404:
 *         description: Không tìm thấy sản phẩm
 *       500:
 *         description: Lỗi máy chủ
 *     security:
 *       - bearerAuth: []
 */
router.put("/:productID", authMiddleware, productController.updateProduct);

/**
 * @swagger
 * /api/products/status/{productID}:
 *   put:
 *     summary: Cập nhật trạng thái sản phẩm (chỉ dành cho admin)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ["available", "unavailable", "out_of_stock"]
 *                 example: "available"
 *             required:
 *               - status
 *     responses:
 *       200:
 *         description: Trạng thái sản phẩm được cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       403:
 *         description: Chỉ admin mới có quyền cập nhật
 *       404:
 *         description: Không tìm thấy sản phẩm
 *       500:
 *         description: Lỗi máy chủ
 *     security:
 *       - bearerAuth: []
 */
router.put(
  "/status/:productID",
  authMiddleware,
  productController.updateProductStatus
);

/**
 * @swagger
 * /api/products/category/{categoryID}:
 *   get:
 *     summary: Lấy sản phẩm theo danh mục
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: categoryID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của danh mục
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       404:
 *         description: Không tìm thấy danh mục
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/category/:categoryID", productController.getProductsByCategory);

/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Tìm kiếm sản phẩm theo tên
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/search", productController.searchProductbyName);

/**
 * @swagger
 * /api/products/delete-image:
 *   post:
 *     summary: Xóa hình ảnh sản phẩm (chỉ dành cho admin)
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productID:
 *                 type: string
 *                 example: "SP0001220425"
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/image1.jpg"
 *             required:
 *               - productID
 *               - imageUrl
 *     responses:
 *       200:
 *         description: Xóa ảnh thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       403:
 *         description: Chỉ admin mới có quyền xóa
 *       404:
 *         description: Không tìm thấy sản phẩm hoặc ảnh
 *       500:
 *         description: Lỗi máy chủ
 *     security:
 *       - bearerAuth: []
 */
router.post("/delete-image", authMiddleware, productController.deleteImage);

module.exports = router;
