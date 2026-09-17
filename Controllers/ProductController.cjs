const ProductModel = require("../Models/ProductSchema.cjs");
const factoryHandler =require('./FactoyHandlers.cjs')
const ApiError = require("../utils/ApiError.cjs");
const multer = require("multer");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");



    const MulterStorage = multer.memoryStorage();
    
    const MulterFilter = function (req, file, cb) {
        // Check image extension
        const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
        const fileExtension = file.originalname
            .split(".")
            .pop()
            .toLowerCase();
    
        if (allowedExtensions.includes(fileExtension)) {
            cb(null, true);
        } else {
            cb(new ApiError("Only Images Allowed", 400), false);
        }
    };
    
    const upload = multer({
        storage: MulterStorage,
        fileFilter: MulterFilter
    });

exports.uploadProductImage = upload.fields([
    {
        name: 'imageCover',
        maxCount: 1,
    },
    {
        name: 'images',
        maxCount: 5,
    }
]);
exports.resizeProductImages = asyncHandler(async (req, res, next) => {

    // =========================
    // 1- Image processing for imageCover
    // =========================

    if (req.files && req.files.imageCover) {

        const imageCoverFileName =
            `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

        await sharp(req.files.imageCover[0].buffer)
            .resize(2000, 1333)
            .toFormat("jpeg")
            .jpeg({ quality: 95 })
            .toFile(`uploads/products/${imageCoverFileName}`);

        // Save image name into req.body
        req.body.imageCover = imageCoverFileName;
    }


    // =========================
    // 2- Image processing for images
    // =========================

    if (req.files && req.files.images) {

        req.body.images = [];

        await Promise.all(
            req.files.images.map(async (img, index) => {

                const imageName =
                    `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

                await sharp(img.buffer)
                    .resize(2000, 1333)
                    .toFormat("jpeg")
                    .jpeg({ quality: 95 })
                    .toFile(`uploads/products/${imageName}`);

                // Save image name into req.body
                req.body.images.push(imageName);
            })
        );
    }

    next();
});

/**
 * @desc    Get all Products
 * @route   GET /api/Product
 * @access  Public
 */
exports.GetAllProducts = factoryHandler.GetAll(ProductModel,'Products')
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