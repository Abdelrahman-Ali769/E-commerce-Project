const CategoryModel = require('../Models/CategorySchema.cjs')
const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const { Result } = require('express-validator');

/**
 * @desc    Get all categories
 * @route   GET /api/category
 * @access  Public
 */
exports.GetAllCategory = asyncHandler(async (req, res) => {

    // Req Query

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const Skip = (page - 1) * limit

    //  Get CategoryModel  

    const Categories = await CategoryModel.find({}).skip(Skip).limit(limit)
    return res.status(204).json({
        Results: Categories.length,
        message: "Categories retrieved  Successfuly",
        data: Categories
    })
})

/**
 * @desc    Get specific category by ID
 * @route   GET /api/category/:id
 * @access  Public
 */

exports.GetCategoryByID = asyncHandler(async (req, res) => {
    const id = req.params.id
    const Category = await CategoryModel.findById(id)
    if (!Category) {
        return res.status(404).json({
            message: ` Not Found this Categroy By this ID ${id}`,
            data: null
        })
    }
    res.status(204).json({
        message: "the Category retrieved successfully",
        data: Category
    })
})

/**
 * @desc    Create new category
 * @route   POST /api/category
 * @access  Private
 */
exports.CreateCategory = asyncHandler(async (req, res) => {
    const name = req.body.name
    const Category = await CategoryModel.create({ name, slug: slugify(name) })
    return res.status(204).json({
        message: "Category Created Successfuly",
        data: Category
    })
})

/**
 * @desc    Update specific category
 * @route   PUT /api/category/:id
 * @access  Private
 */
exports.UpdateCategoryByID = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { name } = req.body
    const Category = await CategoryModel.findOneAndUpdate({ _id: id }, { name, slug: slugify(name) }, { returnDocument: true })
    if (!Category) {
        return res.status(404).json({
            message: ` Not Found this Categroy By this ID ${id}`,
            data: null
        })
    }
    res.status(204).json({
        message: "the Category retrieved successfully",
        data: Category
    })
})


/**
 * @desc    Delete specific category
 * @route   DELETE /api/category/:id
 * @access  Private
 */
exports.DeleteCategoryByID = asyncHandler(async (req, res) => {
    const { id } = req.params
    const DeleteCategory = await CategoryModel.findOneAndDelete(id)
    if (!DeleteCategory) {
        return res.status(404).json({
            message: ` Not Found this Categroy By this ID ${id}`,
            data: null
        })
    }
    res.status(204).json({
        message: "the Category Deleted successfully",
        data: DeleteCategory
    })

})