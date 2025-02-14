const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/authControllers");

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Đăng ký, đăng nhập và xác thực người dùng
 */

/**
 * @swagger
 * /api/auth/send-otp:
 *   post:
 *     summary: Gửi mã OTP đến email
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email của người dùng để nhận OTP
 *     responses:
 *       200:
 *         description: Mã OTP đã được gửi
 *       400:
 *         description: Yêu cầu không hợp lệ
 */
router.post("/send-otp", authControllers.sendOtp);

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Xác thực OTP
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email của người dùng
 *       - in: query
 *         name: otp
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã OTP đã nhận
 *     responses:
 *       200:
 *         description: OTP hợp lệ
 *       400:
 *         description: OTP không hợp lệ hoặc đã hết hạn
 */
router.post("/verify-otp", authControllers.verifyOtp);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký tài khoản người dùng
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email của người dùng (phải xác thực OTP trước)
 *       - in: query
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Tên người dùng
 *       - in: query
 *         name: phone
 *         required: true
 *         schema:
 *           type: string
 *         description: Số điện thoại người dùng
 *       - in: query
 *         name: dateOfBirth
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày sinh người dùng
 *       - in: query
 *         name: password
 *         required: true
 *         schema:
 *           type: string
 *         description: Mật khẩu của người dùng
 *       - in: query
 *         name: avatar
 *         required: false
 *         schema:
 *           type: string
 *         description: URL ảnh đại diện người dùng
 *       - in: query
 *         name: address
 *         required: false
 *         schema:
 *           type: string
 *         description: Địa chỉ của người dùng
 *     responses:
 *       201:
 *         description: Người dùng được tạo thành công
 *       400:
 *         description: Yêu cầu không hợp lệ hoặc email chưa xác thực OTP
 */
router.post("/register", authControllers.registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập người dùng
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *                 description: Email của người dùng
 *               password:
 *                 type: string
 *                 example: "password123"
 *                 description: Mật khẩu của người dùng
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: Thông tin người dùng
 *                 token:
 *                   type: string
 *                   description: JWT token dùng để xác thực
 *       400:
 *         description: Yêu cầu không hợp lệ
 */
router.post("/login", authControllers.login);

// quên mật khẩu: gửi OTP
/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Gửi mã OTP để khôi phục mật khẩu
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email của người dùng để nhận OTP
 *     responses:
 *       200:
 *         description: Mã OTP đã được gửi
 *       400:
 *         description: Yêu cầu không hợp lệ
 */
router.post("/forgot-password", authControllers.forgotPassword);

/**
 * @swagger
 * /api/auth/verify-otp-reset:
 *   post:
 *     summary: Xác thực OTP trước khi đổi mật khẩu
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email của người dùng
 *       - in: query
 *         name: otp
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã OTP đã nhận
 *     responses:
 *       200:
 *         description: OTP hợp lệ, tiếp tục đổi mật khẩu
 *       400:
 *         description: OTP không hợp lệ hoặc đã hết hạn
 */
router.post("/verify-otp-reset", authControllers.verifyOtpForPasswordReset);

/**
 * @swagger
 * /api/auth/update-password:
 *   post:
 *     summary: Cập nhật mật khẩu mới sau khi xác thực OTP
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email của người dùng
 *       - in: query
 *         name: newPassword
 *         required: true
 *         schema:
 *           type: string
 *         description: Mật khẩu mới
 *     responses:
 *       200:
 *         description: Mật khẩu đã được cập nhật thành công
 *       400:
 *         description: Email chưa xác thực OTP hoặc lỗi khác
 */
router.post("/update-password", authControllers.updatePassword);

// đổi mật khẩu
/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Đổi mật khẩu
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email của người dùng
 *       - in: query
 *         name: oldPassword
 *         required: true
 *         schema:
 *           type: string
 *         description: Mật khẩu cũ
 *       - in: query
 *         name: newPassword
 *         required: true
 *         schema:
 *           type: string
 *         description: Mật khẩu mới
 *     responses:
 *       200:
 *         description: Mật khẩu đã được cập nhật
 *       400:
 *         description: Yêu cầu không hợp lệ
 */
router.post("/change-password", authControllers.changePassword);

module.exports = router;
