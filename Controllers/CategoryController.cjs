const CategoryModel = require("../Models/CategorySchema.cjs");
const ApiError = require("../utils/ApiError.cjs");
const factoryHandler = require("./FactoyHandlers.cjs");
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const MulterStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/categories")
    },
    filename: function (req, file, cb) {
        console.log(req.file)
        const ext = file.mimetype.split('/')[1]
        const filename = `category-${uuidv4()}-${Date.now()}.${ext}`
        cb(null, filename);
    }
})
const MulterFilter = function (req, file, cb) {
    // تحقق من الامتداد بس (extension)
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    
    if (allowedExtensions.includes(fileExtension)) {
        cb(null, true);
    } else {
        cb(new ApiError("Only Images Allowed", 400), false);
    }
};

const upload = multer({
    storage: MulterStorage,
    fileFilter: MulterFilter
})
exports.uploadCategoryImage = upload.single("image")

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
exports.UpdateCategoryByID = factoryHandler.UpdateOne(CategoryModel)

/**
 * @desc    Delete specific Category
 * @route   DELETE /api/category/:id
 * @access  Private
 */
exports.DeleteCategoryByID = factoryHandler.DeleteOne(CategoryModel)
