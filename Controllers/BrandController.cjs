const BrandModel = require("../Models/BrandSchema.cjs");
const asyncHandler = require("express-async-handler");
const ApiFeatures = require("../utils/ApiFeatures.cjs");
const factoryHandler =require('./FactoyHandlers.cjs')
const ApiError = require("../utils/ApiError.cjs");
const slugify = require("slugify");

/**
 * @desc    Get all Brands
 * @route   GET /api/brand
 * @access  Public
 */
exports.GetAllBrand = asyncHandler(async (req, res) => {
    const countDocument  = await BrandModel.countDocuments()
        const apiFeatures = new ApiFeatures(
            BrandModel.find(),
            req.query
        )
        .filter()
        .sort()
        .Fields()
        .Search()
        .paginate(countDocument)
        const {mongooseQuery,paginationResult} =apiFeatures

        const Brands = await mongooseQuery;

        res.status(200).json({
            results: Brands.length,
                paginationResult,
            message: "Brands retrieved successfully.",
            data: Brands,
        });
});

/**
 * @desc    Get specific Brand by ID
 * @route   GET /api/brand/:id
 * @access  Public
 */
exports.GetBrandByID = factoryHandler.GetOne(BrandModel)

/**
 * @desc    Create new Brand
 * @route   POST /api/brand
 * @access  Private
 */
exports.CreateBrand = factoryHandler.CreateOne(BrandModel)

/**
 * @desc    Update specific Brand
 * @route   PUT /api/brand/:id
 * @access  Private
 */
exports.UpdateBrandByID =factoryHandler.UpdateOne(BrandModel)

/**
 * @desc    Delete specific Brand
 * @route   DELETE /api/brand/:id
 * @access  Private
 */
exports.DeleteBrandByID = factoryHandler.DeleteOne(BrandModel)