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
    // =========================================================
    // 1) Filtering
    // =========================================================

    // Copy query parameters from the request
    const queryStringObj = { ...req.query };

    // Exclude fields used for pagination, sorting, and field selection
    const excludeFields = ["page", "limit", "sort", "fields","KeyWord"];

    // Remove excluded fields from the filtering object
    excludeFields.forEach((field) => delete queryStringObj[field]);

    // =========================================================
    // 2) Advanced Filtering
    // =========================================================

    // Convert MongoDB operators:
    // gte -> $gte
    // gt  -> $gt
    // lte -> $lte
    // lt  -> $lt
    let queryStr = JSON.stringify(queryStringObj);

    queryStr = queryStr.replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
    );

    // =========================================================
    // 3) Pagination
    // =========================================================

    // Current page (default = 1)
    const page = req.query.page * 1 || 1;

    // Number of products per page (default = 5)
    const limit = req.query.limit * 1 || 5;

    // Number of documents to skip
    const skip = (page - 1) * limit;

    // =========================================================
    // 4) Build Query
    // =========================================================

    let mongooseQuery = ProductModel
        .find(JSON.parse(queryStr))
        .skip(skip)
        .limit(limit);
    // sort 
    if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        mongooseQuery = mongooseQuery.sort(sortBy);
    } else {
        mongooseQuery = mongooseQuery.sort("-createdAt");
    }

    // Field limit by req.query.Fields

    if (req.query.fields) {
        const fields = req.query.fields.split(",").join(" ")
        mongooseQuery = mongooseQuery.select(fields);
    } else {
        mongooseQuery = mongooseQuery.select('-_v');
    }
    // 5) Search    
    if (req.query.KeyWord) {
        const query = {}
        query.$or = [
            { title: { $regex: req.query.KeyWord, $options: 'i' } },
            { description: { $regex: req.query.KeyWord, $options: 'i' } }
        ]
        mongooseQuery = mongooseQuery.find(query)
    }
    // Execute query
    const products = await mongooseQuery;

    // =========================================================
    // 5) Send Response
    // =========================================================

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
exports.UpdateProductByID = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    // Update slug if the product title is changed
    if (req.body.title) {
        req.body.slug = slugify(req.body.title);
    }

    const product = await ProductModel.findOneAndUpdate(
        { _id: id },
        req.body,
        { returnDocument: "after" }
    );

    if (!product) {
        return next(
            new ApiError(`Product not found with ID: ${id}`, 404)
        );
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

    const deletedProduct = await ProductModel.findOneAndDelete({
        _id: id,
    });

    if (!deletedProduct) {
        return next(
            new ApiError(`Product not found with ID: ${id}`, 404)
        );
    }

    res.status(200).json({
        message: "Product deleted successfully.",
        data: deletedProduct,
    });
});