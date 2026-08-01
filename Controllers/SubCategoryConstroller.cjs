const SubCategoryModel = require("../Models/SubCategorySchema.cjs");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError.cjs");
const slugify = require("slugify");


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
