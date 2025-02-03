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
 *     summary: Xác thực OTP và tạo người dùng
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
 *         description: Yêu cầu không hợp lệ
 */
router.post("/verify-otp", authControllers.verifyOtpAndCreateUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập người dùng
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
 *         name: password
 *         required: true
 *         schema:
 *           type: string
 *         description: Mật khẩu của người dùng
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       400:
 *         description: Yêu cầu không hợp lệ
 */
router.post("/login", authControllers.login);

module.exports = router;
