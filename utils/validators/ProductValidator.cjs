const { check, body, Result } = require("express-validator");
const slugify = require("slugify");
const ValidatorMiddleware = require("../../middlewares/validatorMiddleware.cjs");
const ProductModel = require("../../Models/ProductSchema.cjs");
const CategoryModel = require("../../Models/CategorySchema.cjs");
const SubcategoryModel = require("../../Models/SubcategorySchema.cjs");

// Get Specific Product
exports.GetProductValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Product ID Format."),

  ValidatorMiddleware,
];

// Create Product
exports.CreateProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product title is required.")
    .isLength({ min: 3 })
    .withMessage("Product title must be at least 3 characters.")
    .isLength({ max: 150 })
    .withMessage("Product title cannot exceed 150 characters.")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  check("description")
    .notEmpty()
    .withMessage("Product description is required.")
    .isLength({ min: 20 })
    .withMessage("Description must be at least 20 characters.")
    .isLength({ max: 5000 })
    .withMessage("Description cannot exceed 5000 characters."),

  check("quantity")
    .notEmpty()
    .withMessage("Quantity is required.")
    .isNumeric()
    .withMessage("Quantity must be a number."),

  check("price")
    .notEmpty()
    .withMessage("Price is required.")
    .isNumeric()
    .withMessage("Price must be a number."),

  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Discount price must be a number.")
    .custom((value, { req }) => {
      if (value >= req.body.price) {
        throw new Error("Discount price must be less than product price.");
      }
      return true;
    }),

  check("colors")
    .optional()
    .isArray()
    .withMessage("Colors must be an array."),

  check("imageCover")
    .notEmpty()
    .withMessage("Product cover image is required."),

  check("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array."),

  check("category")
    .notEmpty()
    .withMessage("Category is required.")
    .isMongoId()
    .withMessage("Invalid Category ID Format.")
    .custom(async (value) => {
      const categoryID = await CategoryModel.findById(value)
      if (!categoryID) {
        throw new Error("CtegoryID not found.");
      }
      return true
    })
  ,
check("subCategories")
    .optional()
    .isArray()
    .withMessage("SubCategories must be an array.")
    .custom(async (subcategoriesIds) => {

        const SubCategories = await SubcategoryModel.find({
            _id: {
                $exists: true,
                $in: subcategoriesIds,
            }
        });
        if (
            SubCategories.length < 1 ||
            SubCategories.length !== subcategoriesIds.length
        ) {
            throw new Error("Invalid subcategories IDs");
        }
        return true;
    }).custom(async (val, { req }) => {
    const subcategories = await SubcategoryModel.find({
        category: req.body.category
    });
    const subCategoriesIdsInDB = subcategories.map(
        (subCategory) => subCategory._id.toString()
    );
    const checker = (target, arr) => target.every((v) => arr.includes(v));
    if (!checker(val, subCategoriesIdsInDB)) {
        throw new Error(
            "Subcategories do not belong to category"
        );
    }
    return true;
}),

  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid Brand ID Format."),

  check("ratingsAverage")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5."),

  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Ratings quantity must be a number."),
  ValidatorMiddleware,
];

// Update Product
exports.UpdateProductValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Product ID Format."),

  body("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Product title must be at least 3 characters.")
    .isLength({ max: 150 })
    .withMessage("Product title cannot exceed 150 characters.")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  check("description")
    .optional()
    .isLength({ min: 20 })
    .withMessage("Description must be at least 20 characters.")
    .isLength({ max: 5000 })
    .withMessage("Description cannot exceed 5000 characters."),

  check("quantity")
    .optional()
    .isNumeric()
    .withMessage("Quantity must be a number."),

  check("price")
    .optional()
    .isNumeric()
    .withMessage("Price must be a number."),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Price must be a number.")
    .custom(async (value, { req }) => {
      const product = await ProductModel.findById(req.params.id);

      if (!product) {
        throw new Error("Product not found.");
      }

      const price = req.body.price || product.price;

      if (value >= price) {
        throw new Error("Discount price must be less than product price.");
      }

      return true;
    }),

  check("colors")
    .optional()
    .isArray()
    .withMessage("Colors must be an array."),

  check("imageCover")
    .optional()
    .notEmpty()
    .withMessage("Product cover image cannot be empty."),

  check("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array."),

  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid Category ID Format."),

  check("subCategories")
    .optional()
    .isArray()
    .withMessage("SubCategories must be an array."),

  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid Brand ID Format."),

  check("ratingsAverage")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5."),

  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Ratings quantity must be a number."),

  ValidatorMiddleware,
];

// Delete Product
exports.DeleteProductValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Product ID Format."),

  ValidatorMiddleware,
];