const { check, param } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware.cjs");
const bcrypt = require("bcrypt");
const slugify = require("slugify");
const UserModel = require("../../Models/UserSchema.cjs");

// ==================== Create User ====================

exports.CreateUserValidator = [

    // Name
    check("name")
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2, max: 30 })
        .withMessage("Name must be between 2 and 30 characters")
        .custom((value, { req }) => {
            req.body.slug = slugify(value);
            return true;
        }),

    // Email
    check("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please enter a valid email")
        .custom(async (value) => {

            const user = await UserModel.findOne({ email: value });

            if (user) {
                throw new Error("Email already exists");
            }

            return true;
        }),

    // Phone
    check("phone")
        .optional()
        .isMobilePhone(["ar-EG"])
        .withMessage("Please enter a valid Egyptian phone number"),

    // Password
    check("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

    // Password Confirm
    check("passwordConfirm")
        .notEmpty()
        .withMessage("Password confirmation is required")
        .custom((value, { req }) => {

            if (value !== req.body.password) {
                throw new Error(
                    "Password confirmation does not match password"
                );
            }

            return true;
        }),

    // Role
    check("role")
        .optional()
        .isIn(["user", "admin"])
        .withMessage("Role must be either user or admin"),

    // Active
    check("active")
        .optional()
        .isBoolean()
        .withMessage("Active must be true or false"),

    // Run Validation
    validatorMiddleware,
];


// ==================== Update User ====================

exports.UpdateUserValidator = [

    // User ID
    param("id")
        .notEmpty()
        .withMessage("User ID is required")
        .isMongoId()
        .withMessage("Invalid User ID"),

    // Name
    check("name")
        .optional()
        .isLength({ min: 2, max: 30 })
        .withMessage("Name must be between 2 and 30 characters")
        .custom((value, { req }) => {
            req.body.slug = slugify(value);
            return true;
        }),

    // Email
    check("email")
        .optional()
        .isEmail()
        .withMessage("Please enter a valid email")
        .custom(async (value, { req }) => {

            const user = await UserModel.findOne({
                email: value,
                _id: { $ne: req.params.id },
            });

            if (user) {
                throw new Error("Email already exists");
            }

            return true;
        }),

    // Phone
    check("phone")
        .optional()
        .isMobilePhone(["ar-EG"])
        .withMessage("Please enter a valid Egyptian phone number"),

    // Password
    check("password")
        .not()
        .exists()
        .withMessage("Password cannot be updated from this endpoint"),

    // Role
    check("role")
        .optional()
        .isIn(["user", "admin"])
        .withMessage("Role must be either user or admin"),

    // Active
    check("active")
        .optional()
        .isBoolean()
        .withMessage("Active must be true or false"),

    // Run Validation
    validatorMiddleware,
];


// ==================== Change Password Validator ====================

exports.ChangeUserPasswordValidator = [

    // User ID
    param("id")
        .notEmpty()
        .withMessage("User ID is required")
        .isMongoId()
        .withMessage("Invalid User ID"),

    // Current Password
    check("currentPassword")
        .notEmpty()
        .withMessage("You must enter your current password"),

    // Password Confirm
    check("passwordConfirm")
        .notEmpty()
        .withMessage("You must enter the password confirmation"),

    // New Password
    check("password")
        .notEmpty()
        .withMessage("You must enter the new password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters")
        .custom(async (value, { req }) => {

            // Find User
            const user = await UserModel.findById(req.params.id);

            if (!user) {
                throw new Error("There is no user for this id");
            }

            // Check Current Password
            const isCorrectPassword = await bcrypt.compare(
                req.body.currentPassword,
                user.password
            );

            if (!isCorrectPassword) {
                throw new Error("Incorrect current password");
            }

            // New password must be different from current password
            if (req.body.currentPassword === value) {
                throw new Error(
                    "New password cannot be the same as current password"
                );
            }

            // Check Password Confirmation
            if (req.body.passwordConfirm !== value) {
                throw new Error(
                    "Password confirmation does not match password"
                );
            }

            return true;
        }),

    // Run Validation
    validatorMiddleware,
];


// ==================== Get User By ID ====================

exports.GetUserValidator = [

    // User ID
    param("id")
        .notEmpty()
        .withMessage("User ID is required")
        .isMongoId()
        .withMessage("Invalid User ID"),

    // Run Validation
    validatorMiddleware,
];


// ==================== Deactivate User ====================

exports.DeactivateUserValidator = [

    // User ID
    param("id")
        .notEmpty()
        .withMessage("User ID is required")
        .isMongoId()
        .withMessage("Invalid User ID"),

    // Run Validation
    validatorMiddleware,
];