
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

// const {
//     getUserValidator,
//     CreateUserValidator,
//     UpdateUserValidator,
//     DeleteUserValidator
// } = require("../utils/validators/UserValidator.cjs");

const router = express.Router();


// CRUD Operations From User

// GetAllUser
// Private
router.get("/", GetAllUser);


// GetUserByID
// Private
router.get("/:id", GetUserByID);


// CreateUser
// Private
router.post(
    "/",
    uploadUserImage,
    ResizeImages,
    CreateUser
);


// UpdateUserByID
// Private
router.put(
    "/:id",
    uploadUserImage,
    ResizeImages,
    UpdateUserByID
);


// DeleteUserByID
// Private
router.delete("/:id", DeactivateUserByID);


module.exports = router;

