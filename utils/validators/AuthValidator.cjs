const { check } = require("express-validator");

const validatorMiddleware = require("../../middlewares/validatorMiddleware.cjs");

const UserModel = require("../../Models/UserSchema.cjs");

exports.SignUpValidator = [
    check("name")
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2, max: 30 })
        .withMessage("Name must be between 2 and 30 characters"),

    check("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email address")
        .custom(async (email) => {
            const user = await UserModel.findOne({ email });

            if (user) {
                throw new Error("Email already exists");
            }

            return true;
        }),

    check("phone")
        .optional()
        .isMobilePhone(["ar-EG"])
        .withMessage("Invalid Egyptian phone number"),

    check("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

    check("passwordConfirm")
        .notEmpty()
        .withMessage("Password confirmation is required")
        .custom((passwordConfirm, { req }) => {
            if (passwordConfirm !== req.body.password) {
                throw new Error("Password confirmation does not match password");
            }

            return true;
        }),

    validatorMiddleware
];
exports.LoginValidator = [

    check("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email address"),

    check("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

    validatorMiddleware
];
