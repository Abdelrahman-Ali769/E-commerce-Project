const ProductModel = require("../Models/ProductSchema.cjs");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError.cjs");
const slugify = require("slugify");

/**
 * @desc    Get all Products
 * @route   GET /api/Product
 * @access  Public
 */
exports.GetAllProducts = asyncHandler(async (req, res) => {
    // Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;

    // Get Products
    const products = await ProductModel.find({}).skip(skip).limit(limit);

    res.status(200).json({
        results: products.length,
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
        return next(new ApiError(`Product not found with ID: ${id}`, 404));
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
exports.UpdateProductByID = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    if (req.body.title) {
        req.body.slug = slugify(req.body.title);
    }

    const product = await ProductModel.findOneAndUpdate(
        { _id: id },
        req.body,
        { returnDocument: "after" }
    );

    if (!product) {
        return next(new ApiError(`Product not found with ID: ${id}`, 404));
    }

    res.status(200).json({
        message: "Product updated successfully.",
        data: product,
    });
});

/**
 * @desc    Delete specific Product
 * @route   DELETE /api/Product/:id
 * @access  Private
 */
exports.DeleteProductByID = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const deletedProduct = await ProductModel.findOneAndDelete({ _id: id });

    if (!deletedProduct) {
        return next(new ApiError(`Product not found with ID: ${id}`, 404));
    }

    res.status(200).json({
        message: "Product deleted successfully.",
        data: deletedProduct,
    });
});