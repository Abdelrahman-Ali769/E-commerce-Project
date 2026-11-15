const { check } = require("express-validator");
const ReviewValidator = require("../../middlewares/validatorMiddleware.cjs");
const ReviewModel = require('../../Models/ReviewSchema.cjs');

// Get-Specific-Review
exports.getReviewValidator = [
    check("id")
        .isMongoId()
        .withMessage("Invalid Review ID Format"),
    ReviewValidator,
];

// Create-New-Review
exports.CreateReviewValidator = [
    check("title")
        .trim()
        .notEmpty()
        .withMessage('Review title required')
        .isLength({ min: 3 })
        .withMessage('Review title is too short'),

    check('rating')
        .notEmpty()
        .withMessage("Review Rating required")
        .isFloat({ min: 1, max: 5 })
        .withMessage('Rating value must be between 1 and 5'),

    check('review')
        .trim()
        .notEmpty()
        .withMessage('Review required'),

    check('product')
        .notEmpty()
        .withMessage("Product ID Required")
        .isMongoId()
        .withMessage('Invalid Product ID format')
        .bail()
        .custom(async (val, { req }) => {
            const existingReview = await ReviewModel.findOne({
                user: req.user._id,
                product: val
            });
            if (existingReview) {
                throw new Error('You already created a review before');
            }

            return true;
        }),

    ReviewValidator
];

// Update-Review-validator
// Delete-Review-validator