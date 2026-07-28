const { check } = require('express-validator');
const CategoryValidator = require('../../middlewares/validatorMiddleware.cjs')
exports.getCategoryValidator = [
    check('id').isMongoId().withMessage("Invalid Category ID Format "),
    CategoryValidator
]
