const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/authControllers");

/**
 * @swagger
 * /api/auth/send-otp:
 *   post:
 *     summary: Gửi mã OTP đến email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *               username:
 *                 type: string
 *               phone:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               password:
 *                 type: string
 *               avatar:
 *                 type: string
 *               address:
 *                 type: string
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       400:
 *         description: Yêu cầu không hợp lệ
 */
router.post("/login", authControllers.login);


module.exports = router;