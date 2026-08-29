const SubCategoryModel = require("../Models/SubCategorySchema.cjs");
const factoryHandler =require('./FactoyHandlers.cjs')

/**
 * @desc    Set Category ID from URL paramet Werhere We want  Create
 * @usage   Used when creating a SubCategory under a specific Category
 * @example POST /api/category/:categoryId/subcategories
 */
exports.SetCategoryByID = (req, res, next) => {
    if (!req.body.category) {
        req.body.category = req.params.categoryId;
    }
    next();
};

/**
 * @desc    Set filter object based on Category ID Where We want Get 
 * @usage   Used to get SubCategories belonging to a specific Category
 * @example GET /api/category/:categoryId/subcategories
 */
exports.getSubcatByCategoryID = (req, res, next) => {
    let categoryObject = {};

    if (req.params.categoryId) {
        categoryObject = {
            category: req.params.categoryId,
        };
    }
    req.filterObj = categoryObject;
    
    next();
};

/**
 * @desc    Get all Subcategories
 * @route   GET /api/subcategories
 * @access  Public
 */
exports.GetAllSubCategory =factoryHandler.GetAll(SubCategoryModel)

/**
 * @desc    Get specific SubCategory by ID
 * @route   GET /api/subcategory/:id
 * @access  Public
 */
exports.GetSubCategoryByID = factoryHandler.GetOne(SubCategoryModel)

/**
 * @desc    Create new SubCategory
 * @route   POST /api/subcategory
 * @access  Private
 */
exports.CreateSubCategory = factoryHandler.CreateOne(SubCategoryModel)

/**
 * @desc    Update specific SubCategory
 * @route   PUT /api/subcategory/:id
 * @access  Private
 */
exports.UpdateSubCategory =factoryHandler.UpdateOne(SubCategoryModel)

/**
 * @desc    Delete specific SubCategory
 * @route   DELETE /api/subcategory/:id
 * @access  Private
 */
exports.DeleteSubCategory =factoryHandler.DeleteOne(SubCategoryModel)
