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
 *   parameters:
 *     UserIDParam:
 *       in: path
 *       name: userID
 *       required: true
 *       schema:
 *         type: string
 *       description: ID của người dùng
 *     AddressUserID:
 *       in: query
 *       name: userID
 *       required: true
 *       schema:
 *         type: string
 *       description: ID của người dùng
 *     AddressCity:
 *       in: query
 *       name: city
 *       required: true
 *       schema:
 *         type: string
 *       description: Thành phố
 *     AddressDistrict:
 *       in: query
 *       name: district
 *       required: true
 *       schema:
 *         type: string
 *       description: Quận/Huyện
 *     AddressWard:
 *       in: query
 *       name: ward
 *       required: true
 *       schema:
 *         type: string
 *       description: Phường/Xã
 *     AddressStreet:
 *       in: query
 *       name: street
 *       required: true
 *       schema:
 *         type: string
 *       description: Địa chỉ cụ thể
 *     AddressIsDefault:
 *       in: query
 *       name: isDefault
 *       required: false
 *       schema:
 *         type: boolean
 *       description: Đánh dấu là địa chỉ mặc định hay không
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
 *     parameters:
 *       - $ref: '#/components/parameters/AddressUserID'
 *       - $ref: '#/components/parameters/AddressCity'
 *       - $ref: '#/components/parameters/AddressDistrict'
 *       - $ref: '#/components/parameters/AddressWard'
 *       - $ref: '#/components/parameters/AddressStreet'
 *       - $ref: '#/components/parameters/AddressIsDefault'
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
 *       - $ref: '#/components/parameters/UserIDParam'
 *     responses:
 *       200:
 *         description: Danh sách địa chỉ của người dùng
 *       400:
 *         description: Yêu cầu không hợp lệ
 */
router.get("/:userID", addressController.getAddresses);

module.exports = router;
