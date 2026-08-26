const { check ,body} = require("express-validator");
const slugify = require("slugify");

const BrandValidator = require("../../middlewares/validatorMiddleware.cjs");

//Get-Spescific-Brand
exports.getBrandValidator = [
    check("id").isMongoId().withMessage("Invalid Brand ID Format "),
    BrandValidator,
];

//Create-New-Brand
exports.CreateBrandValidator = [
    check("name")
        .notEmpty()
        .withMessage("Name Require")
        .isLength({ min: 5})
        .withMessage("Too Short Brand name")
        .isLength({ max: 15 })
        .withMessage("Too long Brand name")
        .custom((val,{req})=>{
            req.body.slug =slugify(val)
            return true
        }),,
    BrandValidator
];

//Update-Brand-validator
exports.UpdateBrandValidator = [
    check("id").isMongoId().withMessage("Invalid Brand ID Format "),
        check("name")
        .notEmpty()
        .withMessage("Name Require")
        .isLength({ min: 2})
        .withMessage("Too Short Brand name")
        .isLength({ max: 15 })
        .withMessage("Too long Brand name"),
        check("name")
        .custom((val,{req})=>{
            req.body.slug =slugify(val)
            return true
        }),
    BrandValidator
];

//Delete-Brand-validator
exports.DeleteBrandValidator = [
    check("id").isMongoId().withMessage("Invalid Brand ID Format "),
    BrandValidator
];
