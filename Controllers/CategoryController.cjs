const CategoryModel = require("../Models/CategorySchema.cjs");
const factoryHandler = require('./FactoyHandlers.cjs')


/**
 * @desc    Get all Categories
 * @route   GET /api/category
 * @access  Public
 */
exports.GetAllCategory = factoryHandler.GetAll(CategoryModel)

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
