const express = require("express");
const reviewController = require("../controllers/reviewController");
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
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
 *           description: The ID of the user
 *         productID:
 *           type: string
 *           description: The ID of the product
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
 *       example:
 *         reviewID: "RVSP0001-20250226083111-001"
 *         userID: "USER000120250225"
 *         productID: "SP0001"
 *         rating: 5
 *         comment: "Great product!"
 *         imageUrl: ["http://example.com/image1.jpg", "http://example.com/image2.jpg"]
 */

/**
 * @swagger
 * tags:
 *   - name: Reviews
 *     description: API for managing product reviews
 */

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Bad request
 */
router.post("/", reviewController.createReview);

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: List of all reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 */
router.get("/", reviewController.getReviews);

/**
 * @swagger
 * /api/reviews/{reviewID}:
 *   get:
 *     summary: Get a review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: reviewID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the review
 *     responses:
 *       200:
 *         description: Review found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Review not found
 */
router.get("/:reviewID", reviewController.getReviewById);

/**
 * @swagger
 * /api/reviews/{reviewID}:
 *   put:
 *     summary: Update a review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: reviewID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Review not found
 *       400:
 *         description: Bad request
 */
router.put("/:reviewID", reviewController.updateReview);

module.exports = router;
