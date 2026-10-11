const express = require("express");

const {
    GetAllUser,
    GetUserByID,
    CreateUser,
    UpdateUserByID,
    ChangePassword,
    DeactivateUserByID,
    uploadUserImage,
    ResizeImages,
    getLoggedUserData,
    updateLoggedUserPassword,
    updateLoggedUserData
} = require("../Controllers/UserController.cjs");

const {
    GetUserValidator,
    CreateUserValidator,
    UpdateUserValidator,
    ChangeUserPasswordValidator,
    UpdateLoggedUserDataValidator,
    DeactivateUserValidator
} = require("../utils/validators/UserValidator.cjs");

const {
    Protect,
    IsAllowTo
} = require("../Controllers/AuthController.cjs");

const router = express.Router();

// ==================== Get Logged User Data ====================
// GET /api/users/getMe
// Logged-in User Only

router.get(
    "/getMe",
    Protect,
    getLoggedUserData,
    GetUserByID
);

// ==================== Update Logged User Password ====================
// PUT /api/users/updateMyPassword
// Logged-in User Only

router.put(
    "/updateMyPassword",
    Protect,
    updateLoggedUserPassword
);

// ==================== Update Logged User Data ====================
// PUT /api/users/updateMe
// Logged-in User Only

router.put(
    "/updateMe",
    Protect,
    UpdateLoggedUserDataValidator,
    updateLoggedUserData
);

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