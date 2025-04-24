const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const SubCategory = require("../models/subCategoryModel");

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      productCode,
      description,
      category,
      subCategory,
      variations,
    } = req.body;

    // Check if product code exists
    const productExists = await Product.findOne({ productCode });
    if (productExists) {
      return res
        .status(400)
        .json({ message: "Product with this code already exists" });
    }

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if subcategory exists and belongs to the category
    if (subCategory) {
      const subCategoryExists = await SubCategory.findOne({
        _id: subCategory,
        category,
      });
      if (!subCategoryExists) {
        return res
          .status(404)
          .json({
            message:
              "Sub-category not found or does not belong to the selected category",
          });
      }
    }

    // Prepare images array from uploaded files
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        images.push(`/uploads/${file.filename}`);
      });
    }

    const product = new Product({
      name,
      productCode,
      description,
      category,
      subCategory: subCategory || null,
      images,
      variations: variations ? JSON.parse(variations) : [],
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    // Pagination
    const pageSize = 10;
    const page = Number(req.query.page) || 1;

    // Filtering
    const category = req.query.category ? { category: req.query.category } : {};
    const subCategory = req.query.subCategory
      ? { subCategory: req.query.subCategory }
      : {};
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    const count = await Product.countDocuments({
      ...keyword,
      ...category,
      ...subCategory,
    });

    const products = await Product.find({
      ...keyword,
      ...category,
      ...subCategory,
    })
      .populate("category", "name")
      .populate("subCategory", "name")
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("subCategory", "name");

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      productCode,
      description,
      category,
      subCategory,
      variations,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      // Check if product code exists on another product
      if (productCode && productCode !== product.productCode) {
        const productExists = await Product.findOne({ productCode });
        if (productExists && productExists._id.toString() !== req.params.id) {
          return res
            .status(400)
            .json({ message: "Product with this code already exists" });
        }
      }

      // Check if category exists
      if (category && category !== product.category.toString()) {
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
          return res.status(404).json({ message: "Category not found" });
        }
      }

      // Check if subcategory exists and belongs to the category
      if (subCategory && subCategory !== product.subCategory?.toString()) {
        const categoryToCheck = category || product.category;
        const subCategoryExists = await SubCategory.findOne({
          _id: subCategory,
          category: categoryToCheck,
        });
        if (!subCategoryExists) {
          return res
            .status(404)
            .json({
              message:
                "Sub-category not found or does not belong to the selected category",
            });
        }
      }

      // Update fields
      product.name = name || product.name;
      product.productCode = productCode || product.productCode;
      product.description = description || product.description;
      product.category = category || product.category;
      product.subCategory = subCategory || product.subCategory;

      // Add new uploaded images
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          product.images.push(`/uploads/${file.filename}`);
        });
      }

      // Update variations if provided
      if (variations) {
        product.variations = JSON.parse(variations);
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.remove();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Add product variation
// @route   POST /api/products/:id/variations
// @access  Private/Admin
const addProductVariation = async (req, res) => {
  try {
    const { size, color, price, discount, stock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      const variation = {
        size,
        color,
        price,
        discount: discount || 0,
        stock: stock || 0,
      };

      product.variations.push(variation);
      await product.save();

      res.status(201).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update product variation
// @route   PUT /api/products/:id/variations/:variationId
// @access  Private/Admin
const updateProductVariation = async (req, res) => {
  try {
    const { size, color, price, discount, stock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      const variation = product.variations.id(req.params.variationId);

      if (variation) {
        variation.size = size || variation.size;
        variation.color = color || variation.color;
        variation.price = price !== undefined ? price : variation.price;
        variation.discount =
          discount !== undefined ? discount : variation.discount;
        variation.stock = stock !== undefined ? stock : variation.stock;

        await product.save();
        res.json(product);
      } else {
        res.status(404).json({ message: "Variation not found" });
      }
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete product variation
// @route   DELETE /api/products/:id/variations/:variationId
// @access  Private/Admin
const deleteProductVariation = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const variation = product.variations.id(req.params.variationId);

      if (variation) {
        variation.remove();
        await product.save();
        res.json({ message: "Variation removed", product });
      } else {
        res.status(404).json({ message: "Variation not found" });
      }
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addProductVariation,
  updateProductVariation,
  deleteProductVariation,
};
