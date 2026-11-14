const ReviewModel = require("../Models/ReviewSchema.cjs");
const factoryHandler = require("./FactoyHandlers.cjs");
const asyncHandler = require("express-async-handler");


/**
 * @desc    Get all Reviews
 * @route   GET /api/review
 * @access  Public
 */
exports.GetAllReview = factoryHandler.GetAll(ReviewModel);


/**
 * @desc    Get specific Review by ID
 * @route   GET /api/Review/:id
 * @access  Public
 */
exports.GetReviewByID = factoryHandler.GetOne(ReviewModel);


/**
 * @desc    Create new Review
 * @route   POST /api/Review
 * @access  Private
 */
exports.CreateReview = factoryHandler.CreateOne(ReviewModel);


/**
 * @desc    Update specific Review
 * @route   PUT /api/Review/:id
 * @access  Private
 */
exports.UpdateReviewByID = factoryHandler.UpdateOne(ReviewModel);


/**
 * @desc    Delete specific Review
 * @route   DELETE /api/Review/:id
 * @access  Private
 */
exports.DeleteReviewByID = factoryHandler.DeleteOne(ReviewModel);