/**
 * @swagger
 * tags:
 *   name: SubCategories
 *   description: API for managing subcategories under categories
 */

/**
 * @swagger
 * /subcategories:
 *   get:
 *     summary: Get all subcategories
 *     tags: [SubCategories]
 *     responses:
 *       200:
 *         description: List of all subcategories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SubCategory'
 */

/**
 * @swagger
 * /subcategories/category/{categoryId}:
 *   get:
 *     summary: Get subcategories by category ID
 *     tags: [SubCategories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of subcategories for the category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SubCategory'
 */

/**
 * @swagger
 * /subcategories/{id}:
 *   get:
 *     summary: Get a single subcategory by ID
 *     tags: [SubCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Subcategory ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subcategory found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubCategory'
 *       404:
 *         description: Subcategory not found
 */

/**
 * @swagger
 * /subcategories:
 *   post:
 *     summary: Create a new subcategory (Admin only)
 *     tags: [SubCategories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               categoryId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Subcategory created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /subcategories/{id}:
 *   put:
 *     summary: Update a subcategory (Admin only)
 *     tags: [SubCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Subcategory ID
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               categoryId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Subcategory updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Subcategory not found
 */

/**
 * @swagger
 * /subcategories/{id}:
 *   delete:
 *     summary: Delete a subcategory (Admin only)
 *     tags: [SubCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Subcategory ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subcategory deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Subcategory not found
 */

const express = require("express");
const router = express.Router();
const {
  createSubCategory,
  getSubCategories,
  getSubCategoriesByCategory,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
} = require("../controllers/subCategoryController");
const { protect, admin } = require("../middleware/authMiddleware");

// Get all subcategories
router.get("/", getSubCategories);

// Get subcategories by category
router.get("/category/:categoryId", getSubCategoriesByCategory);

// Get single subcategory
router.get("/:id", getSubCategoryById);

// Create new subcategory (admin only)
router.post("/", protect, admin, createSubCategory);

// Update subcategory (admin only)
router.put("/:id", protect, admin, updateSubCategory);

// Delete subcategory (admin only)
router.delete("/:id", protect, admin, deleteSubCategory);

module.exports = router;
