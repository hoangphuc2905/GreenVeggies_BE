const express = require("express");
const router = express.Router();
const stockEntryController = require("../controllers/stockEntryController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

/**
 * @swagger
 * tags:
 *   - name: StockEntries
 *     description: API for managing stock entries
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     StockEntry:
 *       type: object
 *       required:
 *         - stockEntryID
 *         - productID
 *         - entryPrice
 *         - entryQuantity
 *       properties:
 *         stockEntryID:
 *           type: string
 *           description: Auto-generated ID of the stock entry
 *         productID:
 *           type: string
 *           description: ID of the product
 *         entryPrice:
 *           type: number
 *           description: Price per unit for this stock entry
 *         entryQuantity:
 *           type: number
 *           description: Quantity added to stock
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update time
 *       example:
 *         stockEntryID: "SE0001220425"
 *         productID: "SP0001220425"
 *         entryPrice: 500
 *         entryQuantity: 100
 *         createdAt: "2025-04-22T03:10:49.518Z"
 *         updatedAt: "2025-04-22T03:10:49.518Z"
 */

/**
 * @swagger
 * /api/stock-entries:
 *   post:
 *     summary: Tạo bản ghi nhập hàng mới (chỉ dành cho admin)
 *     tags: [StockEntries]
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
 *               entryPrice:
 *                 type: number
 *                 example: 500
 *               entryQuantity:
 *                 type: number
 *                 example: 100
 *             required:
 *               - productID
 *               - entryPrice
 *               - entryQuantity
 *     responses:
 *       201:
 *         description: Bản ghi nhập hàng được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 stockEntry:
 *                   $ref: '#/components/schemas/StockEntry'
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       403:
 *         description: Chỉ admin mới có quyền tạo
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
  adminMiddleware,
  stockEntryController.createStockEntry
);

/**
 * @swagger
 * /api/stock-entries:
 *   get:
 *     summary: Lấy danh sách tất cả bản ghi nhập hàng (chỉ dành cho admin)
 *     tags: [StockEntries]
 *     responses:
 *       200:
 *         description: Danh sách bản ghi nhập hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StockEntry'
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
  stockEntryController.getAllStockEntries
);

/**
 * @swagger
 * /api/stock-entries/{id}:
 *   get:
 *     summary: Lấy thông tin bản ghi nhập hàng theo ID (chỉ dành cho admin)
 *     tags: [StockEntries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID hoặc stockEntryID của bản ghi nhập hàng
 *     responses:
 *       200:
 *         description: Thông tin bản ghi nhập hàng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StockEntry'
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       403:
 *         description: Chỉ admin mới có quyền xem
 *       404:
 *         description: Không tìm thấy bản ghi nhập hàng
 *       500:
 *         description: Lỗi máy chủ
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  stockEntryController.getStockEntryById
);

module.exports = router;
