
const ReviewModel = require("../Models/ReviewSchema.cjs");
const factoryHandler = require("./FactoyHandlers.cjs");

/**
 * @desc    Get all Reviews
 * @route   GET /api/review
 * @access  Public
 */
exports.GetAllReview = factoryHandler.GetAll(ReviewModel);

/**
 * @desc    Get specific Review by ID
 * @route   GET /api/review/:id
 * @access  Public
 */
exports.GetReviewByID = factoryHandler.GetOne(ReviewModel);

/**
 * @desc    Create a new Review
 * @route   POST /api/review
 * @access  Private (User, Manager, Admin)
 */
exports.CreateReview = factoryHandler.CreateOne(ReviewModel);

/**
 * @desc    Update a specific Review
 * @route   PUT /api/review/:id
 * @access  Private (User, Manager, Admin)
 */
exports.UpdateReviewByID = factoryHandler.UpdateOne(ReviewModel);

/**
 * @desc    Delete a specific Review
 * @route   DELETE /api/review/:id
 * @access  Private (User, Manager, Admin)
 */
exports.DeleteReviewByID = factoryHandler.DeleteOne(ReviewModel);
