const express = require("express");
const categoryController = require("../controllers/categoryController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Category
 *     description: Quản lý danh mục sản phẩm
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Lấy danh sách tất cả danh mục
 *     tags:
 *       - Category
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
 *                   categoryID:
 *                     type: string
 *                   name:
 *                     type: string
 */
router.get("/", categoryController.getAllCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Lấy thông tin danh mục theo ID
 *     tags:
 *       - Category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của danh mục cần lấy thông tin
 *     responses:
 *       200:
 *         description: Thành công
 *       404:
 *         description: Không tìm thấy danh mục
 */
router.get("/:id", categoryController.getCategoryById);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Tạo danh mục mới
 *     tags:
 *       - Category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryID:
 *                 type: string
 *                 example: "CATE123"
 *               name:
 *                 type: string
 *                 example: "Rau Củ Quả"
 *     responses:
 *       201:
 *         description: Danh mục được tạo thành công
 *       400:
 *         description: Yêu cầu không hợp lệ
 */
router.post("/", categoryController.createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Cập nhật danh mục theo ID
 *     tags:
 *       - Category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của danh mục cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Trái Cây Tươi"
 *     responses:
 *       200:
 *         description: Danh mục được cập nhật thành công
 *       404:
 *         description: Không tìm thấy danh mục
 *       400:
 *         description: Yêu cầu không hợp lệ
 */
router.put("/:id", categoryController.updateCategory);

module.exports = router;
