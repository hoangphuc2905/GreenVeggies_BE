const userControllers = require("../controllers/userControllers");
const router = require("express").Router();

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Lấy danh sách tất cả người dùng
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng cần xóa
 *     responses:
 *       200:
 *         description: Thành công
 *       404:
 *         description: Không tìm thấy người dùng
 */
// router.delete("/:id", middlewareControllers.verifyTokenAndAdminAuth, userControllers.deleteUser);

/**
 * @swagger
 * /api/user/account-info:
 *   get:
 *     summary: Lấy thông tin tài khoản người dùng
 *     responses:
 *       200:
 *         description: Thành công
 *       401:
 *         description: Không được phép
 */
// router.get("/account-info", middlewareControllers.verifyToken, userControllers.getUserInfo);

module.exports = router;    