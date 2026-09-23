
const express = require("express");

const {
    GetAllUser,
    GetUserByID,
    CreateUser,
    UpdateUserByID,
    DeactivateUserByID,
    uploadUserImage,
    ResizeImages
} = require("../Controllers/UserController.cjs");

const {
    GetUserValidator,
    CreateUserValidator,
    UpdateUserValidator,
    DeactivateUserValidator
} = require("../utils/validators/UserValidator.cjs");

const router = express.Router();


// CRUD Operations From User

// ==================== Get All Users ====================
// GET /api/users
// Get all active users
// Private

router.get(
    "/",
    GetAllUser
);


// ==================== Get User By ID ====================
// GET /api/users/:id
// Get a specific user by ID
// Private

router.get(
    "/:id",
    GetUserValidator,
    GetUserByID
);


// ==================== Create User ====================
// POST /api/users
// Create a new user
// Private

router.post(
    "/",
    uploadUserImage,
    ResizeImages,
    CreateUserValidator,
    CreateUser
);


// ==================== Update User ====================
// PUT /api/users/:id
// Update a specific user by ID
// Private

router.put(
    "/:id",
    uploadUserImage,
    ResizeImages,
    UpdateUserValidator,
    UpdateUserByID
);


// ==================== Deactivate User ====================
// DELETE /api/users/:id
// Deactivate a specific user by ID (Soft Delete)
// Private

router.delete(
    "/:id",
    DeactivateUserValidator,
    DeactivateUserByID
);
module.exports = router