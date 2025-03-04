const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");

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
 *       400:
 *         description: Yêu cầu không hợp lệ
 */
router.post("/", addressController.createAddress);

/**
 * @swagger
 * /api/address/{userID}:
 *   get:
 *     summary: Lấy danh sách địa chỉ của người dùng
 *     tags:
 *       - Address
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Danh sách địa chỉ của người dùng
 *       400:
 *         description: Yêu cầu không hợp lệ
 */
router.get("/:userID", addressController.getAddresses);

module.exports = router;
