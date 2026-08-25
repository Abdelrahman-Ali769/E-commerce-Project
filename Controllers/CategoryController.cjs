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
exports.GetCategoryByID = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const category = await CategoryModel.findById(id);

    if (!category) {
        return next(
            new ApiError(
                `Category not found with ID: ${id}`,
                404
            )
        );
    }

    res.status(200).json({
        message: "Category retrieved successfully.",
        data: category,
    });
});

/**
 * @desc    Create new Category
 * @route   POST /api/category
 * @access  Private
 */
exports.CreateCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;

    // Generate slug automatically from category name
    const category = await CategoryModel.create({
        name,
        slug: slugify(name),
    });

    res.status(201).json({
        message: "Category created successfully.",
        data: category,
    });
});

/**
 * @desc    Update specific Category
 * @route   PUT /api/category/:id
 * @access  Private
 */
exports.UpdateCategoryByID = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;

    // Update category name and regenerate slug
    const category = await CategoryModel.findOneAndUpdate(
        { _id: id },
        {
            name,
            slug: slugify(name),
        },
        {
            returnDocument: "after",
        }
    );

    if (!category) {
        return next(
            new ApiError(
                `Category not found with ID: ${id}`,
                404
            )
        );
    }

    res.status(200).json({
        message: "Category updated successfully.",
        data: category,
    });
});

/**
 * @desc    Delete specific Category
 * @route   DELETE /api/category/:id
 * @access  Private
 */
exports.DeleteCategoryByID = factoryHandler.DeleteOne(CategoryModel)
