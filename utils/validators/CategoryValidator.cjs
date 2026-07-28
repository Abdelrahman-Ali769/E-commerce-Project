const { check } = require("express-validator");
const CategoryValidator = require("../../middlewares/validatorMiddleware.cjs");

//Get-Spescific-Category
exports.getCategoryValidator = [
    check("id").isMongoId().withMessage("Invalid Category ID Format "),
    CategoryValidator,
];

//Create-New-Category
exports.CreateCategoryValidator = [
    check("name")
        .notEmpty()
        .withMessage("Name Require")
        .isLength({ min: 3 })
        .withMessage("Too Short category name")
        .isLength({ max: 32 })
        .withMessage("Too long category name"),
    CategoryValidator
];

//Update-Category-validator
exports.UpdateCategoryValidator = [
    check("id").isMongoId().withMessage("Invalid Category ID Format "),
    CategoryValidator
];

//Delete-Category-validator
exports.DeleteCategoryValidator = [
    check("id").isMongoId().withMessage("Invalid Category ID Format "),
    CategoryValidator
];
