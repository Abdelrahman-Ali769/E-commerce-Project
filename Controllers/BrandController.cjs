const BrandModel = require('../Models/BrandSchema.cjs')
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError.cjs')
const { Result } = require('express-validator');
const slugify = require('slugify');

/**
 * @desc    Get all Brands
 * @route   GET /api/Brand
 * @access  Public
 */
exports.GetAllBrand = asyncHandler(async (req, res,) => {

    // Req Query

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const Skip = (page - 1) * limit

    //  Get BrandModel  

    const Brands = await BrandModel.find({}).skip(Skip).limit(limit)
    return res.status(200).json({
        Results: Brands.length,
        message: "Brands retrieved  Successfuly",
        data: Brands
    })
})

/**
 * @desc    Get specific Brand by ID
 * @route   GET /api/Brand/:id
 * @access  Public
 */

exports.GetBrandByID = asyncHandler(async (req, res, next) => {
    const id = req.params.id
    const Brand = await BrandModel.findById(id)
    if (!Brand) {
        return next(new ApiError(` Not Found this Brand By this ID ${id}`, 404))
    }
    res.status(200).json({
        message: "the Brand retrieved successfully",
        data: Brand
    })
})

/**
 * @desc    Create new Brand
 * @route   POST /api/Brand
 * @access  Private
 */
exports.CreateBrand = asyncHandler(async (req, res,) => {
    const { name } = req.body
    const Brand = await BrandModel.create({ name, slug: slugify(name) })
    return res.status(201).json({
        message: "Brand Created Successfuly",
        data: Brand
    })
})

/**
 * @desc    Update specific Brand
 * @route   PUT /api/Brand/:id
 * @access  Private
 */
exports.UpdateBrandByID = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const { name } = req.body
    const Brand = await BrandModel.findOneAndUpdate({ _id: id }, { name, slug: slugify(name), }, { returnDocument: "after" })
    if (!Brand) {
        return next(new ApiError(` Not Found this Brand By this ID ${id}`, 404))

    }
    res.status(200).json({
        message: "the Brand retrieved successfully",
        data: Brand
    })
})


/**
 * @desc    Delete specific Brand
 * @route   DELETE /api/Brand/:id
 * @access  Private
 */
exports.DeleteBrandByID = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const DeleteBrand = await BrandModel.findOneAndDelete({ _id: id })
    if (!DeleteBrand) {
        return next(new ApiError(` Not Found this Brand By this ID ${id}`, 404))

    }
    res.status(200).json({
        message: "the Brand Deleted successfully",
        data: DeleteBrand
    })

})