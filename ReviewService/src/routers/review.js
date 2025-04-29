const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   - name: Reviews
 *     description: API for managing product reviews
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - reviewID
 *         - userID
 *         - productID
 *         - rating
 *         - comment
 *       properties:
 *         reviewID:
 *           type: string
 *           description: Auto-generated ID of the review
 *         userID:
 *           type: string
 *           description: ID of the user who created the review
 *         productID:
 *           type: string
 *           description: ID of the product being reviewed
 *         rating:
 *           type: number
 *           description: Rating given by the user (1-5)
 *         comment:
 *           type: string
 *           description: Review comment
 *         imageUrl:
 *           type: array
 *           items:
 *             type: string
 *           description: Image URLs related to the review
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update time
 *       example:
 *         reviewID: "RVSP0001220425-USER000120250225-001"
 *         userID: "USER000120250225"
 *         productID: "SP0001220425"
 *         rating: 5
 *         comment: "Sản phẩm tuyệt vời!"
 *         imageUrl: ["https://example.com/image1.jpg"]
 *         createdAt: "2025-04-22T03:10:49.518Z"
 *         updatedAt: "2025-04-22T03:10:49.518Z"
 */

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Tạo đánh giá mới
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productID:
 *                 type: string
 *                 example: "SP0001220425"
 *               rating:
 *                 type: number
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Sản phẩm tuyệt vời!"
 *               imageUrl:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["https://example.com/image1.jpg"]
 *             required:
 *               - productID
 *               - rating
 *               - comment
 *     responses:
 *       201:
 *         description: Đánh giá được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 review:
 *                   $ref: '#/components/schemas/Review'
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       403:
 *         description: Bạn chưa mua sản phẩm này
 *       404:
 *         description: Không tìm thấy sản phẩm
 *       500:
 *         description: Lỗi máy chủ
 *     security:
 *       - bearerAuth: []
 */
router.post("/", authMiddleware, reviewController.createReview);

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Lấy danh sách tất cả đánh giá
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: Danh sách đánh giá
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/", reviewController.getReviews);

/**
 * @swagger
 * /api/reviews/{reviewID}:
 *   get:
 *     summary: Lấy thông tin đánh giá theo ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: reviewID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đánh giá
 *     responses:
 *       200:
 *         description: Thông tin đánh giá
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Không tìm thấy đánh giá
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/:reviewID", reviewController.getReviewById);

/**
 * @swagger
 * /api/reviews/{reviewID}:
 *   put:
 *     summary: Cập nhật đánh giá theo ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: reviewID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đánh giá
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: "Sản phẩm tốt, nhưng cần cải thiện đóng gói."
 *               imageUrl:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["https://example.com/image1.jpg"]
 *             required:
 *               - rating
 *               - comment
 *     responses:
 *       200:
 *         description: Đánh giá được cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 review:
 *                   $ref: '#/components/schemas/Review'
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập hoặc token không hợp lệ
 *       403:
 *         description: Không có quyền cập nhật đánh giá này
 *       404:
 *         description: Không tìm thấy đánh giá
 *       500:
 *         description: Lỗi máy chủ
 *     security:
 *       - bearerAuth: []
 */
router.put("/:reviewID", authMiddleware, reviewController.updateReview);

module.exports = router;
