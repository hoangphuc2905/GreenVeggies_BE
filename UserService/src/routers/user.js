const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: Quản lý thông tin người dùng
 */

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Lấy danh sách tất cả người dùng (chỉ dành cho admin)
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Danh sách người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID của người dùng
 *                   username:
 *                     type: string
 *                     description: Tên người dùng
 *                   email:
 *                     type: string
 *                     description: Email người dùng
 *                   phone:
 *                     type: string
 *                     description: Số điện thoại người dùng
 *                   dateOfBirth:
 *                     type: string
 *                     format: date
 *                     description: Ngày sinh người dùng
 *                   avatar:
 *                     type: string
 *                     description: URL ảnh đại diện
 *                   role:
 *                     type: string
 *                     description: Vai trò của người dùng
 *                   accountStatus:
 *                     type: string
 *                     description: Trạng thái tài khoản
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       403:
 *         description: Chỉ admin mới có quyền truy cập
 *       500:
 *         description: Lỗi server
 *     security:
 *       - bearerAuth: []
 */
router.get("/", authMiddleware, adminMiddleware, userControllers.getAllUsers);

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
 *         description: Thông tin người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID của người dùng
 *                 username:
 *                   type: string
 *                   description: Tên người dùng
 *                 email:
 *                   type: string
 *                   description: Email người dùng
 *                 phone:
 *                   type: string
 *                   description: Số điện thoại người dùng
 *                 dateOfBirth:
 *                   type: string
 *                   format: date
 *                   description: Ngày sinh người dùng
 *                 avatar:
 *                   type: string
 *                   description: URL ảnh đại diện
 *                 role:
 *                   type: string
 *                   description: Vai trò của người dùng
 *                 accountStatus:
 *                   type: string
 *                   description: Trạng thái tài khoản
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       403:
 *         description: Không có quyền truy cập thông tin người dùng này
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 *     security:
 *       - bearerAuth: []
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
 *               username:
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
 *                 type: object
 *                 description: Địa chỉ của người dùng
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   country:
 *                     type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Thông báo thành công
 *                 user:
 *                   type: object
 *                   description: Thông tin người dùng đã cập nhật
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       403:
 *         description: Không có quyền cập nhật thông tin người dùng này
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 *     security:
 *       - bearerAuth: []
 */
router.put("/:userID", authMiddleware, userControllers.updateProfile);

/**
 * @swagger
 * /api/user/{userID}/account-status:
 *   patch:
 *     summary: Cập nhật trạng thái tài khoản người dùng
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng cần cập nhật trạng thái
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive, Suspended]
 *                 description: Trạng thái tài khoản mới
 *                 example: Active
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái tài khoản thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       403:
 *         description: Không có quyền cập nhật trạng thái tài khoản này
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 *     security:
 *       - bearerAuth: []
 */
router.patch(
  "/:userID/account-status",
  authMiddleware,
  adminMiddleware,
  userControllers.updateAccountStatus
);

module.exports = router;
