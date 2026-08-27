const CategoryModel = require("../Models/CategorySchema.cjs");
const asyncHandler = require("express-async-handler");
const ApiFeatures = require("../utils/ApiFeatures.cjs");
const factoryHandler = require('./FactoyHandlers.cjs')
const ApiError = require("../utils/ApiError.cjs");
const slugify = require("slugify");

/**
 * @desc    Get all Categories
 * @route   GET /api/category
 * @access  Public
 */
exports.GetAllCategory = asyncHandler(async (req, res) => {
    const countDocument = await CategoryModel.countDocuments()
    const apiFeatures = new ApiFeatures(
        CategoryModel.find(),
        req.query
    )
        .filter()
        .sort()
        .Fields()
        .Search()
        .paginate(countDocument)
    const { mongooseQuery, paginationResult } = apiFeatures

    const Categories = await mongooseQuery;

    res.status(200).json({
        results: Categories.length,
        paginationResult,
        message: "Categories retrieved successfully.",
        data: Categories,
    });
});

/**
 * @desc    Get specific Category by ID
 * @route   GET /api/category/:id
 * @access  Public
 */
exports.GetCategoryByID = factoryHandler.GetOne(CategoryModel)

/**
 * @desc    Create new Category
 * @route   POST /api/category
 * @access  Private
 */
exports.CreateCategory = factoryHandler.CreateOne(CategoryModel)

/**
 * @desc    Update specific Category
 * @route   PUT /api/category/:id
 * @access  Private
 */
exports.UpdateCategoryByID =factoryHandler.UpdateOne(CategoryModel)

/**
 * @desc    Delete specific Category
 * @route   DELETE /api/category/:id
 * @access  Private
 */
exports.DeleteCategoryByID = factoryHandler.DeleteOne(CategoryModel)
