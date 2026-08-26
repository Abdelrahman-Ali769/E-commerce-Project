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
exports.GetProductByID = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const product = await ProductModel.findById(id);

    if (!product) {
        return next(
            new ApiError(`Product not found with ID: ${id}`, 404)
        );
    }

    res.status(200).json({
        message: "Product retrieved successfully.",
        data: product,
    });
});

/**
 * @desc    Create new Product
 * @route   POST /api/Product
 * @access  Private
 */
exports.CreateProduct = asyncHandler(async (req, res) => {
    // Generate slug automatically from product title
    req.body.slug = slugify(req.body.title);

    const product = await ProductModel.create(req.body);

    res.status(201).json({
        message: "Product created successfully.",
        data: product,
    });
});

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