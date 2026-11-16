
const express = require("express");

const {
    GetAllReview,
    GetReviewByID,
    CreateReview,
    UpdateReviewByID,
    DeleteReviewByID
} = require("../Controllers/ReviewController.cjs");


const {
    getReviewValidator,
    CreateReviewValidator,
    UpdateReviewValidator
} =require('../utils/validators/ReviewValidator.cjs')
const { Protect, IsAllowTo } = require('../Controllers/AuthController.cjs');

const router = express.Router();

// ==================== Get All Reviews ====================

/**
 * @desc    Get all Reviews
 * @route   GET /
 * @access  Public
 */
router.get(
    "/",
    GetAllReview
);

// ==================== Get Review By ID ====================

/**
 * @desc    Get specific Review by ID
 * @route   GET /:id
 * @access  Public
 */
router.get(
    "/:id",
    getReviewValidator,
    GetReviewByID
);

// ==================== Create Review ====================

/**
 * @desc    Create a new Review
 * @route   POST /
 * @access  Private (User)
 */
router.post(
    "/",
    Protect,
    IsAllowTo('user'),
    CreateReviewValidator,
    CreateReview
);

// ==================== Update Review ====================

/**
 * @desc    Update a specific Review
 * @route   PUT /:id
 * @access  Private (User)
 */
router.put(
    "/:id",
    Protect,
    IsAllowTo('user'),
    UpdateReviewValidator,
    UpdateReviewByID
);

// ==================== Delete Review ====================

/**
 * @desc    Delete a specific Review
 * @route   DELETE /:id
 * @access  Private (Admin, Manager,User)
 */
router.delete(
    "/:id",
    Protect,
    IsAllowTo('admin', 'manager','user'),
    DeleteReviewByID
);

module.exports = router;
