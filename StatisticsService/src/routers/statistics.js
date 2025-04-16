const express = require("express");
const statisticsController = require("../controllers/statisticsController");

const router = express.Router();

/**
 * @swagger
 * /api/statistics/daily:
 *   get:
 *     summary: Lấy thống kê hàng ngày
 *     tags: [Statistics]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Ngày cần thống kê (DD-MM-YYYY)
 *     responses:
 *       200:
 *         description: Thống kê hàng ngày thành công
 */
router.get("/daily", statisticsController.getDailyStatistics);

/**
 * @swagger
 * /api/statistics/revenue-by-payment-method:
 *   get:
 *     summary: Thống kê doanh thu theo phương thức thanh toán
 *     tags: [Statistics]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Ngày cần thống kê (DD-MM-YYYY)
 *     responses:
 *       200:
 *         description: Thống kê doanh thu theo phương thức thanh toán thành công
 */
router.get(
  "/revenue-by-payment-method",
  statisticsController.getRevenueByPaymentMethod
);

/**
 * @swagger
 * /api/statistics/order-status:
 *   get:
 *     summary: Thống kê đơn hàng theo trạng thái
 *     tags: [Statistics]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Ngày cần thống kê (DD-MM-YYYY)
 *     responses:
 *       200:
 *         description: Thống kê đơn hàng theo trạng thái thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Thống kê đơn hàng theo trạng thái thành công.
 *                 stats:
 *                   type: object
 *                   properties:
 *                     currentStats:
 *                       type: object
 *                       additionalProperties:
 *                         type: integer
 *                       example:
 *                         Pending: 10
 *                         Shipped: 5
 *                         Delivered: 12
 *                         Cancelled: 2
 *                     percentageDifference:
 *                       type: object
 *                       additionalProperties:
 *                         type: string
 *                       example:
 *                         Pending: "25.00"
 *                         Shipped: "-20.00"
 *                         Delivered: "50.00"
 *                         Cancelled: "0.00"
 *       400:
 *         description: Lỗi do thiếu tham số ngày
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: object
 *                   properties:
 *                     date:
 *                       type: string
 *                       example: Vui lòng cung cấp ngày để thống kê.
 *       500:
 *         description: Lỗi máy chủ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: object
 *                   properties:
 *                     server:
 *                       type: string
 *                       example: Lỗi khi thống kê đơn hàng theo trạng thái.
 */
router.get("/order-status", statisticsController.getOrderStatisticsByStatus);

module.exports = router;
