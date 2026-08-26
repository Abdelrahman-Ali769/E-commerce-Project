const { check } = require("express-validator");
const slugify = require("slugify");
const SubCategoryValidator = require("../../middlewares/validatorMiddleware.cjs");

//Get-Spescific-Category
exports.getSubCategoryValidator = [
    check("id").isMongoId().withMessage("Invalid SubCategory ID Format "),
    SubCategoryValidator,
];

//Create-New-Category
exports.CreateSubCategoryValidator = [
    check("name")
        .notEmpty()
        .withMessage("Name Require")
        .isLength({ min: 2 })
        .withMessage("Too Short category name")
        .isLength({ max: 32 })
        .withMessage("Too long category name"),
        check('category').notEmpty().isMongoId().withMessage("Invalid Category ID Format"),
    SubCategoryValidator
];

//Update-Category-validator
exports.UpdateSubCategoryValidator = [
    check("id").notEmpty().isMongoId().withMessage("Invalid Category ID Format "),
    check("name").custom((val,{req})=>{
        req.body.slug =slugify(val)
        return true
    })
    
    ,
    SubCategoryValidator
];

//Delete-Category-validator
exports.DeleteSubCategoryValidator = [
    check("id").notEmpty().isMongoId().withMessage("Invalid Category ID Format "),
    SubCategoryValidator
];
