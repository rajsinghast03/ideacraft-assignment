const SubCategory = require("../models/subCategoryModel");
const Category = require("../models/categoryModel");

// @desc    Create a new subcategory
// @route   POST /api/subcategories
// @access  Private/Admin
const createSubCategory = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ message: "Parent category not found" });
    }

    // Check if subcategory already exists in this category
    const subCategoryExists = await SubCategory.findOne({ name, category });
    if (subCategoryExists) {
      return res
        .status(400)
        .json({ message: "Sub-category already exists in this category" });
    }

    // Create subcategory
    const subCategory = new SubCategory({
      name,
      description,
      category,
    });

    const createdSubCategory = await subCategory.save();
    res.status(201).json(createdSubCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all subcategories
// @route   GET /api/subcategories
// @access  Public
const getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find({}).populate(
      "category",
      "name"
    );
    res.json(subCategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get subcategories by category ID
// @route   GET /api/subcategories/category/:categoryId
// @access  Public
const getSubCategoriesByCategory = async (req, res) => {
  try {
    const subCategories = await SubCategory.find({
      category: req.params.categoryId,
    }).populate("category", "name");
    res.json(subCategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get subcategory by ID
// @route   GET /api/subcategories/:id
// @access  Public
const getSubCategoryById = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id).populate(
      "category",
      "name"
    );

    if (subCategory) {
      res.json(subCategory);
    } else {
      res.status(404).json({ message: "Sub-category not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a subcategory
// @route   PUT /api/subcategories/:id
// @access  Private/Admin
const updateSubCategory = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    const subCategory = await SubCategory.findById(req.params.id);

    if (subCategory) {
      // Check if category exists if changing
      if (category && category !== subCategory.category.toString()) {
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
          return res.status(404).json({ message: "Parent category not found" });
        }
      }

      subCategory.name = name || subCategory.name;
      subCategory.description = description || subCategory.description;
      subCategory.category = category || subCategory.category;

      const updatedSubCategory = await subCategory.save();
      res.json(updatedSubCategory);
    } else {
      res.status(404).json({ message: "Sub-category not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a subcategory
// @route   DELETE /api/subcategories/:id
// @access  Private/Admin
const deleteSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id);

    if (subCategory) {
      await subCategory.remove();
      res.json({ message: "Sub-category removed" });
    } else {
      res.status(404).json({ message: "Sub-category not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createSubCategory,
  getSubCategories,
  getSubCategoriesByCategory,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
};
