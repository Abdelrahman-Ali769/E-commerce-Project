const SubCategoryModel = require("../Models/SubCategorySchema.cjs");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError.cjs");
const slugify = require("slugify");


/**
 * @desc    Get all Subcategories
 * @route   GET /api/Subcategories
 * @access  Public
 */
exports.GetAllSubCategory = asyncHandler(async (req, res,) => {


    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const Skip = (page - 1) * limit

    //  Get SubCategoryModel  

    const SubCategories = await SubCategoryModel.find({}).skip(Skip).limit(limit)
    return res.status(200).json({
        Results: SubCategories.length,
        message: "SubCategories retrieved  Successfuly",
        data: SubCategories
    })
})

/**
 * @desc    Get specific Subcategory by ID
 * @route   GET /api/ Subcategory/:id
 * @access  Public
 */

exports.GetSubCategoryByID = asyncHandler(async (req, res, next) => {
    const id = req.params.id
    const SubCategory = await SubCategoryModel.findById(id)
    if (!SubCategory) {
        return next(new ApiError(` Not Found this SubCategory By this ID ${id}`, 404))
    }
    res.status(200).json({
        message: "the SubCategory retrieved successfully",
        data: SubCategory
    })
})

/**
 * @desc    Create new Subcategory
 * @route   POST /api/Subcategory
 * @access  Private
 */
exports.CreateSubCategory = asyncHandler(async (req, res) => {
    const { name, category } = req.body;
    const SubCategory = await SubCategoryModel.create({
        name,
        slug: slugify(name),
        category,
    });
    res.status(201).json({
        message: "Category Created Successfuly",
        data: SubCategory,
    });
});

/**
 * @desc    update new Subcategory
 * @route   update /api/Subcategory
 * @access  Private
 */
exports.UpdateSubCategory = asyncHandler(async (req, res,next) => {
    const { id } = req.params
    const { name,category } = req.body
    const SubCategory = await SubCategoryModel.findOneAndUpdate({ _id:id }, { name, slug: slugify(name) ,category},{ returnDocument: true })
    if (!SubCategory) {
        return next(new ApiError(` Not Found this Categroy By this ID ${id}`, 404))
    }
    res.status(200).json({
        message: "SubCategory Updated Successfuly",
        data: SubCategory
    })
})

/**
 * @desc    Delete new Subcategory
 * @route   delete /api/Subcategory
 * @access  Private
 */
exports.DeleteSubCategory = asyncHandler(async (req, res,next) => {
    const { id } = req.params
    const SubCategory = await SubCategoryModel.findOneAndDelete({ _id: id })
    if (!SubCategory) {
        return next(new ApiError(` Not Found this Categroy By this ID ${id}`, 404))
    }
    res.status(200).json({
        message: "SubCategory Deleted Successfuly",
        data: SubCategory
    })
})


