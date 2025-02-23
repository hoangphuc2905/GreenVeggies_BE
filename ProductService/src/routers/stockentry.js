const express = require("express");
const router = express.Router();
const stockEntryController = require("../controllers/stockEntryController");

/**
 * @swagger
 * /api/stock-entries:
 *   post:
 *     summary: Tạo bản ghi nhập hàng mới
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
 *               entryPrice:
 *                 type: number
 *               entryQuantity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Bản ghi nhập hàng mới đã được tạo
 *       400:
 *         description: Lỗi khi tạo bản ghi nhập hàng
 */
router.post("/", stockEntryController.createStockEntry);

/**
 * @swagger
 * /api/stock-entries:
 *   get:
 *     summary: Lấy tất cả các bản ghi nhập hàng
 *     tags: [StockEntries]
 *     responses:
 *       200:
 *         description: Danh sách các bản ghi nhập hàng
 *       400:
 *         description: Lỗi khi lấy danh sách các bản ghi nhập hàng
 */
router.post("/", stockEntryController.getAllStockEntries);

/**
 * @swagger
 * /api/stock-entries/{id}:
 *   get:
 *     summary: Lấy thông tin bản ghi nhập hàng theo ID thiệt không
 *     tags: [StockEntries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bản ghi nhập hàng
 *     responses:
 *       200:
 *         description: Thông tin bản ghi nhập hàng
 *       400:
 *         description: Lỗi khi lấy thông tin bản ghi nhập hàng
 */
router.get("/:id", stockEntryController.getStockEntryById);

module.exports = router;
