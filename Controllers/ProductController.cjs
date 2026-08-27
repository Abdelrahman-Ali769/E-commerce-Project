const ProductModel = require("../Models/ProductSchema.cjs");
const asyncHandler = require("express-async-handler");
const ApiFeatures = require("../utils/ApiFeatures.cjs");
 const factoryHandler =require('./FactoyHandlers.cjs')
const ApiError = require("../utils/ApiError.cjs");
const slugify = require("slugify");

/**
 * @desc    Get all Products
 * @route   GET /api/Product
 * @access  Public
 */
exports.GetAllProducts = asyncHandler(async (req, res) => {
    const countDocument  = await ProductModel.countDocuments()
    const apiFeatures = new ApiFeatures(
        ProductModel.find(),
        req.query
    )
    .filter()
    .sort()
    .Fields()
    .Search('Products')
    .paginate(countDocument)
    const {mongooseQuery,paginationResult} =apiFeatures

    const products = await mongooseQuery;

    res.status(200).json({
        results: products.length,
            paginationResult,
        message: "Products retrieved successfully.",
        data: products,
    });
});
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