const SubCategoryModel = require("../Models/SubCategorySchema.cjs");
const asyncHandler = require("express-async-handler");
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
    // =========================================================
    // 1) Pagination
    // =========================================================

    // Current page (default = 1)
    const page = req.query.page * 1 || 1;

    // Number of SubCategories per page (default = 5)
    const limit = req.query.limit * 1 || 5;

    // Number of documents to skip
    const skip = (page - 1) * limit;

    // =========================================================
    // 2) Get SubCategories
    // =========================================================

    const subCategories = await SubCategoryModel
        .find(req.filterObj)
        .skip(skip)
        .limit(limit);

    // =========================================================
    // 3) Send Response
    // =========================================================

    res.status(200).json({
        results: subCategories.length,
        message: "SubCategories retrieved successfully.",
        data: subCategories,
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
exports.CreateSubCategory = asyncHandler(async (req, res) => {
    const { name, category } = req.body;

    // Generate slug automatically from SubCategory name
    const subCategory = await SubCategoryModel.create({
        name,
        slug: slugify(name),
        category,
    });

    res.status(201).json({
        message: "SubCategory created successfully.",
        data: subCategory,
    });
});

/**
 * @desc    Update specific SubCategory
 * @route   PUT /api/subcategory/:id
 * @access  Private
 */
exports.UpdateSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name, category } = req.body;

    // Update name, slug, and category
    const subCategory = await SubCategoryModel.findOneAndUpdate(
        { _id: id },
        {
            name,
            slug: slugify(name),
            category,
        },
        {
            returnDocument: "after",
        }
    );

    if (!subCategory) {
        return next(
            new ApiError(
                `SubCategory not found with ID: ${id}`,
                404
            )
        );
    }

    res.status(200).json({
        message: "SubCategory updated successfully.",
        data: subCategory,
    });
});

/**
 * @desc    Delete specific SubCategory
 * @route   DELETE /api/subcategory/:id
 * @access  Private
 */
exports.DeleteSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const deletedSubCategory = await SubCategoryModel.findOneAndDelete({
        _id: id,
    });

    if (!deletedSubCategory) {
        return next(
            new ApiError(
                `SubCategory not found with ID: ${id}`,
                404
            )
        );
    }

    res.status(200).json({
        message: "SubCategory deleted successfully.",
        data: deletedSubCategory,
    });
});