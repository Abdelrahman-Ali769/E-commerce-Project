const { check, param } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware.cjs");
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
                _id: { $ne: req.params.id } // $ne =>  ID must not equal the current user ID 
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
        .optional()
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),


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


// ==================== Get User By ID ====================

exports.GetUserValidator = [

    param("id")
        .notEmpty()
        .withMessage("User ID is required")
        .isMongoId()
        .withMessage("Invalid User ID"),

    validatorMiddleware,
];


// ==================== Deactivate User ====================

exports.DeactivateUserValidator = [

    param("id")
        .notEmpty()
        .withMessage("User ID is required")
        .isMongoId()
        .withMessage("Invalid User ID"),

    validatorMiddleware,
];