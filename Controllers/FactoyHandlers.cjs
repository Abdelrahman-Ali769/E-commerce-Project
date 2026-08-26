const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const ApiError = require("../utils/ApiError.cjs");

exports.DeleteOne =(Model)=> asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const DeleteDocs = await Model.findOneAndDelete({
        _id: id,
    });

    if (!DeleteDocs) {
        return next(
            new ApiError(
                `Document not found with ID: ${id}`,
                404
            )
        );
    }
    res.status(200).json({
        message: "Document  deleted successfully.",
        data: DeleteDocs,
    });
})
exports.UpdateOne =(Model)=>asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;

    // Update Document name and regenerate slug
    const Document = await Model.findOneAndUpdate(
        { _id: id },
        {
            name,
            slug: slugify(name),
        },
        {
            returnDocument: "after",
        }
    );

    if (!Document) {
        return next(
            new ApiError(
                `Document not found with ID: ${id}`,
                404
            )
        );
    }

    res.status(200).json({
        message: "Document updated successfully.",
        data: Document,
    });
});

