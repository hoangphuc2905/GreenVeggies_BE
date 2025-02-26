const userControllers = require("../controllers/userControllers");
const router = require("express").Router();

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: Lấy thông tin người dùng
 */

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Lấy danh sách tất cả người dùng
 *     tags:
 *       - User
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
 *                   email:
 *                     type: string
 */
router.get("/", userControllers.getAllUsers);

/**
 * @swagger
 * /api/user/{userID}:
 *   get:
 *     summary: Lấy thông tin tài khoản người dùng
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng cần lấy thông tin
 *     responses:
 *       200:
 *         description: Thành công
 *       401:
 *         description: Không được phép
 */
router.get("/:userID", userControllers.getUserInfo);

/**
 * @swagger
 * /api/user/{userID}:
 *   put:
 *     summary: Cập nhật thông tin người dùng
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên người dùng
 *               email:
 *                 type: string
 *                 description: Email người dùng
 *               phone:
 *                 type: string
 *                 description: Số điện thoại người dùng
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 description: Ngày sinh của người dùng
 *               avatar:
 *                 type: string
 *                 description: URL ảnh đại diện người dùng
 *               address:
 *                 type: string
 *                 description: Địa chỉ của người dùng
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       401:
 *         description: Không được phép
 *       404:
 *         description: Không tìm thấy người dùng
 */
router.put("/:userID", userControllers.updateProfile);

module.exports = router;
