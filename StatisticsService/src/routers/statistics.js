const express = require("express");
const router = express.Router();
const statisticsController = require("../controllers/statisticsController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

/**
 * @swagger
 * tags:
 *   - name: Statistics
 *     description: API for retrieving statistical data (Admin only)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DailyStatistics:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *           example: "2025-04-22"
 *         totalOrders:
 *           type: integer
 *           example: 50
 *         totalRevenue:
 *           type: number
 *           example: 5000000
 *         totalProductsSold:
 *           type: integer
 *           example: 200
 *     RevenueByPaymentMethod:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *           example: "2025-04-22"
 *         stats:
 *           type: object
 *           additionalProperties:
 *             type: number
 *           example:
 *             COD: 2000000
 *             Card: 1500000
 *             BankTransfer: 1500000
 *     OrderStatusStatistics:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *           example: "2025-04-22"
 *         currentStats:
 *           type: object
 *           additionalProperties:
 *             type: integer
 *           example:
 *             Pending: 10
 *             Shipped: 5
 *             Delivered: 12
 *             Cancelled: 2
 *         percentageDifference:
 *           type: object
 *           additionalProperties:
 *             type: string
 *           example:
 *             Pending: "25.00"
 *             Shipped: "-20.00"
 *             Delivered: "50.00"
 *             Cancelled: "0.00"
 *     YearlyRevenueStatistics:
 *       type: object
 *       properties:
 *         year:
 *           type: integer
 *           example: 2025
 *         stats:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               month:
 *                 type: integer
 *                 example: 1
 *               revenue:
 *                 type: number
 *                 example: 1000000
 *         totalRevenue:
 *           type: number
 *           example: 12000000
 *     DailyOrderStatistics:
 *       type: object
 *       properties:
 *         month:
 *           type: integer
 *           example: 4
 *         year:
 *           type: integer
 *           example: 2025
 *         stats:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               day:
 *                 type: integer
 *                 example: 1
 *               totalOrders:
 *                 type: integer
 *                 example: 5
 */

/**
 * @swagger
 * /api/statistics/daily:
 *   get:
 *     summary: Lấy thống kê hàng ngày (chỉ dành cho admin)
 *     tags: [Statistics]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Ngày cần thống kê (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Thống kê hàng ngày thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Thống kê hàng ngày thành công.
 *                 stats:
 *                   $ref: '#/components/schemas/DailyStatistics'
 *       400:
 *         description: Thiếu hoặc sai định dạng tham số ngày
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
 *                       example: Vui lòng cung cấp ngày hợp lệ (YYYY-MM-DD).
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       403:
 *         description: Chỉ admin mới có quyền truy cập
 *       500:
 *         description: Lỗi máy chủ
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/daily",
  authMiddleware,
  adminMiddleware,
  statisticsController.getDailyStatistics
);

/**
 * @swagger
 * /api/statistics/revenue-by-payment-method:
 *   get:
 *     summary: Thống kê doanh thu theo phương thức thanh toán (chỉ dành cho admin)
 *     tags: [Statistics]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Ngày cần thống kê (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Thống kê doanh thu theo phương thức thanh toán thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Thống kê doanh thu theo phương thức thanh toán thành công.
 *                 stats:
 *                   $ref: '#/components/schemas/RevenueByPaymentMethod'
 *       400:
 *         description: Thiếu hoặc sai định dạng tham số ngày
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
 *                       example: Vui lòng cung cấp ngày hợp lệ (YYYY-MM-DD).
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       403:
 *         description: Chỉ admin mới có quyền truy cập
 *       500:
 *         description: Lỗi máy chủ
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/revenue-by-payment-method",
  authMiddleware,
  adminMiddleware,
  statisticsController.getRevenueByPaymentMethod
);

/**
 * @swagger
 * /api/statistics/order-status:
 *   get:
 *     summary: Thống kê đơn hàng theo trạng thái (chỉ dành cho admin)
 *     tags: [Statistics]
 *     parameters:
 *       - in: query
 *         name: day
 *         schema:
 *           type: integer
 *         required: false
 *         description: Ngày (nếu nhập ngày, phải nhập đủ tháng và năm)
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         required: false
 *         description: Tháng (nếu nhập tháng, phải nhập năm)
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         required: true
 *         description: Năm (bắt buộc)
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
 *                   $ref: '#/components/schemas/OrderStatusStatistics'
 *       400:
 *         description: Thiếu hoặc sai định dạng tham số ngày/tháng/năm
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
 *                       example: Vui lòng cung cấp năm hợp lệ (YYYY).
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       403:
 *         description: Chỉ admin mới có quyền truy cập
 *       500:
 *         description: Lỗi máy chủ
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/order-status",
  authMiddleware,
  adminMiddleware,
  statisticsController.getOrderStatisticsByStatus
);

/**
 * @swagger
 * /api/statistics/yearly-revenue:
 *   get:
 *     summary: Thống kê doanh thu theo năm (chỉ dành cho admin)
 *     tags: [Statistics]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
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
 *                   $ref: '#/components/schemas/YearlyRevenueStatistics'
 *       400:
 *         description: Thiếu hoặc sai định dạng tham số năm
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
 *                       example: Vui lòng cung cấp năm hợp lệ (YYYY).
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       403:
 *         description: Chỉ admin mới có quyền truy cập
 *       500:
 *         description: Lỗi máy chủ
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/yearly-revenue",
  authMiddleware,
  adminMiddleware,
  statisticsController.getYearlyRevenueStatistics
);

/**
 * @swagger
 * /api/statistics/daily-orders:
 *   get:
 *     summary: Thống kê số lượng đơn hàng theo ngày trong tháng (chỉ dành cho admin)
 *     tags: [Statistics]
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tháng cần thống kê (1-12)
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         required: true
 *         description: Năm cần thống kê (YYYY)
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
 *                   $ref: '#/components/schemas/DailyOrderStatistics'
 *       400:
 *         description: Thiếu hoặc sai định dạng tham số tháng/năm
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
 *                       example: Vui lòng cung cấp tháng (1-12) và năm hợp lệ (YYYY).
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       403:
 *         description: Chỉ admin mới có quyền truy cập
 *       500:
 *         description: Lỗi máy chủ
 *     security:
 *       - bearerAuth: []
 */
router.get(
  "/daily-orders",
  authMiddleware,
  adminMiddleware,
  statisticsController.getDailyOrderStatisticsByMonth
);

/**
 * @swagger
 * /api/statistics/orderbydateandstatus:
 *   get:
 *     summary: Thống kê danh sách đơn hàng theo trạng thái và ngày tháng năm
 *     tags: [Statistics]
 *     parameters:
 *       - in: query
 *         name: day
 *         schema:
 *           type: integer
 *         required: false
 *         description: Ngày (nếu nhập ngày, phải nhập đủ tháng và năm)
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         required: false
 *         description: Tháng (nếu nhập tháng, phải nhập năm)
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         required: true
 *         description: Năm (bắt buộc)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         required: true
 *         description: Trạng thái đơn hàng (bắt buộc)
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Lỗi máy chủ
 */
router.get(
  "/orderbydateandstatus",
  authMiddleware,
  adminMiddleware,
  statisticsController.getOrderStatisticsByDateAndStatus
);

module.exports = router;
