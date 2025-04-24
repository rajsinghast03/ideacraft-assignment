/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User authentication and profile management
 */
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /users/admin:
 *   post:
 *     summary: Register an admin (requires secret key)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - secret
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               secret:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin registered
 *       403:
 *         description: Invalid secret key
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login user and return JWT token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile (Authenticated users only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */

const express = require("express");
const router = express.Router();
const {
  registerUser,
  registerAdmin,
  loginUser,
  getUserProfile,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// Register new user
router.post("/", registerUser);

// Admin registration (requires secret key)
router.post("/admin", registerAdmin);

// Login user
router.post("/login", loginUser);

// Get user profile
router.get("/profile", protect, getUserProfile);

module.exports = router;
