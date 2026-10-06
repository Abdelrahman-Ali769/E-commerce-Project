const express = require("express");

const {
    GetAllUser,
    GetUserByID,
    CreateUser,
    UpdateUserByID,
    ChangePassword,
    DeactivateUserByID,
    uploadUserImage,
    ResizeImages
} = require("../Controllers/UserController.cjs");

const {
    GetUserValidator,
    CreateUserValidator,
    UpdateUserValidator,
    ChangeUserPasswordValidator,
    DeactivateUserValidator
} = require("../utils/validators/UserValidator.cjs");

const {
    Protect,
    IsAllowTo
} = require("../Controllers/AuthController.cjs");

const router = express.Router();


// ==================== Get All Users ====================
// GET /api/users
// Admin Only

router.get(
    "/",
    Protect,
    IsAllowTo("admin"),
    GetAllUser
);


// ==================== Get User By ID ====================
// GET /api/users/:id
// Admin Only

router.get(
    "/:id",
    Protect,
    IsAllowTo("admin"),
    GetUserValidator,
    GetUserByID
);


// ==================== Create User ====================
// POST /api/users
// Admin Only

router.post(
    "/",
    Protect,
    IsAllowTo("admin"),
    uploadUserImage,
    CreateUserValidator,
    ResizeImages,
    CreateUser
);


// ==================== Update User ====================
// PUT /api/users/:id
// Admin Only

router.put(
    "/:id",
    Protect,
    IsAllowTo("admin"),
    uploadUserImage,
    UpdateUserValidator,
    ResizeImages,
    UpdateUserByID
);


// ==================== Change Password ====================
// PUT /api/users/change-password/:id
// User can change his own password

router.put(
    "/change-password/:id",
    Protect,
    ChangeUserPasswordValidator,
    ChangePassword
);


// ==================== Deactivate User ====================
// DELETE /api/users/:id
// Admin Only

router.delete(
    "/:id",
    Protect,
    IsAllowTo("admin"),
    DeactivateUserValidator,
    DeactivateUserByID
);


module.exports = router;