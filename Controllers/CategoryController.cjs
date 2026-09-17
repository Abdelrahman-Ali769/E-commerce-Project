const CategoryModel = require("../Models/CategorySchema.cjs");
const asyncHandler = require("express-async-handler");
const factoryHandler = require("./FactoyHandlers.cjs");
const sharp = require("sharp");
const {uploadSingleImage} =require('../middlewares/ImageMiddleware.cjs')
const { v4: uuidv4 } = require("uuid");




exports.uploadCategoryImage = uploadSingleImage("image")

exports.ResizeImages = asyncHandler(async (req, res, next) => {
    const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

    if (!req.file) {
        return next();
    }

    await sharp(req.file.buffer)
        .resize(700, 700) // Resize image to new dimensions
        .toFormat("jpeg") // Convert image to JPEG
        .jpeg({ quality: 95 }) // Reduce quality to save space
        .toFile(`uploads/categories/${filename}`); // Save image
            req.body.image =filename 
    next();
});

/**
 * @desc    Get all Categories
 * @route   GET /api/category
 * @access  Public
 */

exports.GetAllCategory = factoryHandler.GetAll(CategoryModel);

/**
 * @desc    Get specific Category by ID
 * @route   GET /api/category/:id
 * @access  Public
 */

exports.GetCategoryByID = factoryHandler.GetOne(CategoryModel);

/**
 * @desc    Create new Category
 * @route   POST /api/category
 * @access  Private
 */

exports.CreateCategory = factoryHandler.CreateOne(CategoryModel);

/**
 * @desc    Update specific Category
 * @route   PUT /api/category/:id
 * @access  Private
 */

exports.UpdateCategoryByID = factoryHandler.UpdateOne(CategoryModel);

/**
 * @desc    Delete specific Category
 * @route   DELETE /api/category/:id
 * @access  Private
 */

exports.DeleteCategoryByID = factoryHandler.DeleteOne(CategoryModel);
