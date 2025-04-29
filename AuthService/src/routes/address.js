const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       properties:
 *         userID:
 *           type: string
 *           description: ID của người dùng
 *         city:
 *           type: string
 *           description: Thành phố
 *         district:
 *           type: string
 *           description: Quận/Huyện
 *         ward:
 *           type: string
 *           description: Phường/Xã
 *         street:
 *           type: string
 *           description: Địa chỉ cụ thể
 *         isDefault:
 *           type: boolean
 *           description: Đánh dấu là địa chỉ mặc định hay không
 *       required:
 *         - userID
 *         - city
 *         - district
 *         - ward
 *         - street
 *   parameters:
 *     UserIDParam:
 *       in: query
 *       name: userID
 *       required: true
 *       schema:
 *         type: string
 *       description: ID của người dùng
 */

/**
 * @swagger
 * tags:
 *   - name: Address
 *     description: Quản lý địa chỉ của người dùng
 */

/**
 * @swagger
 * /api/address:
 *   post:
 *     summary: Thêm địa chỉ mới cho người dùng
 *     tags:
 *       - Address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       201:
 *         description: Địa chỉ đã được thêm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Thông báo thành công
 *                 address:
 *                   $ref: '#/components/schemas/Address'
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       403:
 *         description: Không có quyền thêm địa chỉ cho người dùng này
 *       500:
 *         description: Lỗi server
 *     security:
 *       - bearerAuth: []
 */
router.post("/", authMiddleware, addressController.createAddress);

/**
 * @swagger
 * /api/address:
 *   get:
 *     summary: Lấy danh sách địa chỉ của người dùng
 *     tags:
 *       - Address
 *     parameters:
 *       - $ref: '#/components/parameters/UserIDParam'
 *     responses:
 *       200:
 *         description: Danh sách địa chỉ của người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Address'
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       403:
 *         description: Không có quyền xem địa chỉ của người dùng này
 *       500:
 *         description: Lỗi server
 *     security:
 *       - bearerAuth: []
 */
router.get("/", authMiddleware, addressController.getAddresses);

module.exports = router;
