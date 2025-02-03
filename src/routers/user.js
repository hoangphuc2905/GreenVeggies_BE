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
 * /api/user/{id}:
 *   delete:
 *     summary: Xóa người dùng theo ID
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng cần xóa
 *     responses:
 *       200:
 *         description: Người dùng đã được xóa thành công
 *       404:
 *         description: Không tìm thấy người dùng
 */
// router.delete("/:id", middlewareControllers.verifyTokenAndAdminAuth, userControllers.deleteUser);

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Lấy thông tin tài khoản người dùng
 *     tags:
 *       - User
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: false
 *         schema:
 *           type: string
 *         description: ID của người dùng cần lấy thông tin (tùy chọn)
 *     responses:
 *       200:
 *         description: Thành công
 *       401:
 *         description: Không được phép
 */
router.get("/:id", userControllers.getUserInfo);

module.exports = router;
