const BrandModel = require("../Models/BrandSchema.cjs");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError.cjs");
const slugify = require("slugify");

/**
 * @desc    Get all Brands
 * @route   GET /api/brand
 * @access  Public
 */
exports.GetAllBrand = asyncHandler(async (req, res) => {
    // =========================================================
    // 1) Pagination
    // =========================================================

    // Current page (default = 1)
    const page = req.query.page * 1 || 1;

    // Number of brands per page (default = 5)
    const limit = req.query.limit * 1 || 5;

    // Number of documents to skip
    const skip = (page - 1) * limit;

    // =========================================================
    // 2) Get Brands
    // =========================================================

    const brands = await BrandModel
        .find({})
        .skip(skip)
        .limit(limit);

    // =========================================================
    // 3) Send Response
    // =========================================================

    res.status(200).json({
        results: brands.length,
        message: "Brands retrieved successfully.",
        data: brands,
    });
});

/**
 * @desc    Get specific Brand by ID
 * @route   GET /api/brand/:id
 * @access  Public
 */
exports.GetBrandByID = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const brand = await BrandModel.findById(id);

    if (!brand) {
        return next(
            new ApiError(
                `Brand not found with ID: ${id}`,
                404
            )
        );
    }

    res.status(200).json({
        message: "Brand retrieved successfully.",
        data: brand,
    });
});

/**
 * @desc    Create new Brand
 * @route   POST /api/brand
 * @access  Private
 */
exports.CreateBrand = asyncHandler(async (req, res) => {
    const { name } = req.body;

    // Generate slug automatically from Brand name
    const brand = await BrandModel.create({
        name,
        slug: slugify(name),
    });

    res.status(201).json({
        message: "Brand created successfully.",
        data: brand,
    });
});

/**
 * @desc    Update specific Brand
 * @route   PUT /api/brand/:id
 * @access  Private
 */
exports.UpdateBrandByID = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;

    // Update Brand name and regenerate slug
    const brand = await BrandModel.findOneAndUpdate(
        { _id: id },
        {
            name,
            slug: slugify(name),
        },
        {
            returnDocument: "after",
        }
    );

    if (!brand) {
        return next(
            new ApiError(
                `Brand not found with ID: ${id}`,
                404
            )
        );
    }

    res.status(200).json({
        message: "Brand updated successfully.",
        data: brand,
    });
});

/**
 * @desc    Delete specific Brand
 * @route   DELETE /api/brand/:id
 * @access  Private
 */
exports.DeleteBrandByID = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const deletedBrand = await BrandModel.findOneAndDelete({
        _id: id,
    });

    if (!deletedBrand) {
        return next(
            new ApiError(
                `Brand not found with ID: ${id}`,
                404
            )
        );
    }

    res.status(200).json({
        message: "Brand deleted successfully.",
        data: deletedBrand,
    });
});