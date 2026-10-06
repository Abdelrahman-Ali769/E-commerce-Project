const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError.cjs");
const ApiFeatures = require("../utils/ApiFeatures.cjs");


/**
 * @desc    Delete specific document
 * @route   Factory Handler
 * @access  Internal
 */
exports.DeleteOne = (Model) => asyncHandler(async (req, res, next) => {

    const DeleteDocs = await Model.findByIdAndDelete(
        req.params.id
    );

    if (!DeleteDocs) {
        return next(
            new ApiError(
                `Document not found with ID: ${req.params.id}`,
                404
            )
        );
    }

    res.status(200).json({
        message: "Document deleted successfully.",
        data: DeleteDocs,
    });
});


/**
 * @desc    Update specific document
 * @route   Factory Handler
 * @access  Internal
 */
exports.UpdateOne = (Model) => asyncHandler(async (req, res, next) => {

    const Document = await Model.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            returnDocument: "after",
        }
    );

    if (!Document) {
        return next(
            new ApiError(
                `Document not found with ID: ${req.params.id}`,
                404
            )
        );
    }

    res.status(200).json({
        message: "Document updated successfully.",
        data: Document,
    });
});


/**
 * @desc    Create new document
 * @route   Factory Handler
 * @access  Internal
 */
exports.CreateOne = (Model) => asyncHandler(async (req, res) => {

    const Document = await Model.create(req.body);

    res.status(201).json({
        message: "Document created successfully.",
        data: Document,
    });
});


/**
 * @desc    Get specific document by ID
 * @route   Factory Handler
 * @access  Internal
 */
exports.GetOne = (Model) => asyncHandler(async (req, res, next) => {

    const Document = await Model.findById(req.params.id);

    if (!Document) {
        return next(
            new ApiError(
                `Document not found with ID: ${req.params.id}`,
                404
            )
        );
    }

    res.status(200).json({
        message: "Document retrieved successfully.",
        data: Document,
    });
});


/**
 * @desc    Get all documents
 * @route   Factory Handler
 * @access  Internal
 */
exports.GetAll = (
    Model,
    modelName = " "
) => asyncHandler(async (req, res) => {

    let filter = {};

    if (req.filterObj) {
        filter = req.filterObj;
    }

    const countDocument = await Model.countDocuments(filter);

    const apiFeatures = new ApiFeatures(
        Model.find(filter),
        req.query
    )
        .filter()
        .sort()
        .Fields()
        .Search(modelName)
        .paginate(countDocument);

    const { mongooseQuery, paginationResult } = apiFeatures;

    const Document = await mongooseQuery;

    res.status(200).json({
        results: Document.length,
        paginationResult,
        message: "Document retrieved successfully.",
        data: Document,
    });
});