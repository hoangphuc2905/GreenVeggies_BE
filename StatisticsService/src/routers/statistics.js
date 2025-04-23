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

/**
 * @swagger
 * /api/statistics/yearly-revenue:
 *   get:
 *     summary: Thống kê doanh thu theo năm
 *     tags: [Statistics]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: string
 *           format: yyyy
 *         required: true
 *         description: Năm cần thống kê (YYYY)
 *     responses:
 *       200:
 *         description: Thống kê doanh thu theo năm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Thống kê doanh thu theo năm thành công.
 *                 stats:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: integer
 *                         example: 1
 *                       revenue:
 *                         type: number
 *                         example: 1000000
 *                 totalRevenue:
 *                   type: number
 *                   example: 12000000
 *       400:
 *         description: Lỗi do thiếu tham số năm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: object
 *                   properties:
 *                     year:
 *                       type: string
 *                       example: Vui lòng cung cấp năm để thống kê.
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
 *                       example: Lỗi khi thống kê doanh thu theo năm.
 */
router.get("/yearly-revenue", statisticsController.getYearlyRevenueStatistics);

/**
 * @swagger
 * /api/statistics/daily-orders:
 *   get:
 *     summary: Thống kê số lượng đơn hàng theo ngày trong tháng
 *     tags: [Statistics]
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *           example: 4
 *         required: true
 *         description: Tháng cần thống kê (1-12)
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *           example: 2025
 *         required: true
 *         description: Năm cần thống kê
 *     responses:
 *       200:
 *         description: Thống kê số lượng đơn hàng theo ngày trong tháng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Thống kê số lượng đơn hàng theo ngày trong tháng thành công.
 *                 stats:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       day:
 *                         type: integer
 *                         example: 1
 *                       totalOrders:
 *                         type: integer
 *                         example: 5
 *       400:
 *         description: Lỗi do thiếu tham số tháng hoặc năm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Vui lòng cung cấp tháng và năm để thống kê.
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
 *                       example: Lỗi khi thống kê số lượng đơn hàng theo ngày trong tháng.
 */
router.get(
  "/daily-orders",
  statisticsController.getDailyOrderStatisticsByMonth
);



module.exports = router;
