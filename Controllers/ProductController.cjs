const ProductModel = require("../Models/ProductSchema.cjs");
const factoryHandler =require('./FactoyHandlers.cjs')


/**
 * @desc    Get all Products
 * @route   GET /api/Product
 * @access  Public
 */
exports.GetAllProducts = factoryHandler.GetAll(ProductModel)
/**
 * @desc    Get specific Product by ID
 * @route   GET /api/Product/:id
 * @access  Public
 */
exports.GetProductByID =  factoryHandler.GetOne(ProductModel)

/**
 * @desc    Create new Product
 * @route   POST /api/Product
 * @access  Private
 */
exports.CreateProduct = factoryHandler.CreateOne(ProductModel)      

/**
 * @desc    Update specific Product
 * @route   PUT /api/Product/:id
 * @access  Private
 */
exports.UpdateProductByID = factoryHandler.UpdateOne(ProductModel)

/**
 * @desc    Delete specific Product
 * @route   DELETE /api/Product/:id
 * @access  Private
 */
exports.DeleteProductByID = factoryHandler.DeleteOne(ProductModel)