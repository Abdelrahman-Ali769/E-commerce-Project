const BrandModel = require("../Models/BrandSchema.cjs");
const factoryHandler =require('./FactoyHandlers.cjs')

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