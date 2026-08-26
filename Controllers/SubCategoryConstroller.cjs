const SubCategoryModel = require("../Models/SubCategorySchema.cjs");
const asyncHandler = require("express-async-handler");
const ApiFeatures = require("../utils/ApiFeatures.cjs");
 const factoryHandler =require('./FactoyHandlers.cjs')
const ApiError = require("../utils/ApiError.cjs");
const slugify = require("slugify");

/**
 * @desc    Set Category ID from URL parameter
 * @usage   Used when creating a SubCategory under a specific Category
 * @example POST /api/category/:categoryId/subcategories
 */
exports.SetCategoryByID = (req, res, next) => {
    if (!req.body.category) {
        req.body.category = req.params.categoryId;
    }

    next();
};

/**
 * @desc    Set filter object based on Category ID
 * @usage   Used to get SubCategories belonging to a specific Category
 * @example GET /api/category/:categoryId/subcategories
 */
exports.getSubcatByCategoryID = (req, res, next) => {
    let categoryObject = {};

    if (req.params.categoryId) {
        categoryObject = {
            category: req.params.categoryId,
        };
    }

    req.filterObj = categoryObject;
    
    next();
};

/**
 * @desc    Get all Subcategories
 * @route   GET /api/subcategories
 * @access  Public
 */
exports.GetAllSubCategory = asyncHandler(async (req, res) => {
    const countDocument  = await SubCategoryModel.countDocuments()
    const apiFeatures = new ApiFeatures(
        SubCategoryModel.find(),
        req.query
    )
    .filter()
    .sort()
    .Fields()
    .Search()
    .paginate(countDocument)
    const {mongooseQuery,paginationResult} =apiFeatures

    const SubCategories = await mongooseQuery;

    res.status(200).json({
        results: SubCategories.length,
            paginationResult,
        message: "SubCategories retrieved successfully.",
        data: SubCategories,
    });
});

/**
 * @desc    Get specific SubCategory by ID
 * @route   GET /api/subcategory/:id
 * @access  Public
 */
exports.GetSubCategoryByID = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const subCategory = await SubCategoryModel.findById(id);

    if (!subCategory) {
        return next(
            new ApiError(
                `SubCategory not found with ID: ${id}`,
                404
            )
        );
    }

    res.status(200).json({
        message: "SubCategory retrieved successfully.",
        data: subCategory,
    });
});

/**
 * @desc    Create new SubCategory
 * @route   POST /api/subcategory
 * @access  Private
 */
exports.CreateSubCategory = factoryHandler.CreateOne(SubCategoryModel)

/**
 * @desc    Update specific SubCategory
 * @route   PUT /api/subcategory/:id
 * @access  Private
 */
exports.UpdateSubCategory =factoryHandler.UpdateOne(SubCategoryModel)

/**
 * @desc    Delete specific SubCategory
 * @route   DELETE /api/subcategory/:id
 * @access  Private
 */
exports.DeleteSubCategory =factoryHandler.DeleteOne(SubCategoryModel)
