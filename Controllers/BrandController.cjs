const BrandModel = require("../Models/BrandSchema.cjs");
const factoryHandler =require('./FactoyHandlers.cjs')
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const {uploadSingleImage} =require('../middlewares/SingleImageMiddleware.cjs')
const { v4: uuidv4 } = require("uuid");



exports.uploadBrandImage = uploadSingleImage("image")

exports.ResizeImages = asyncHandler(async (req, res, next) => {
    const filename = `Brand-${uuidv4()}-${Date.now()}.jpeg`;

    if (!req.file) {
        return next();
    }

    await sharp(req.file.buffer)
        .resize(700, 700) // Resize image to new dimensions
        .toFormat("jpeg") // Convert image to JPEG
        .jpeg({ quality: 95 }) // Reduce quality to save space
        .toFile(`uploads/Brands/${filename}`); // Save image
            req.body.image =filename 
    next();
});
/**
 * @desc    Get all Brands
 * @route   GET /api/brand
 * @access  Public
 */
exports.GetAllBrand = factoryHandler.GetAll(BrandModel)

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