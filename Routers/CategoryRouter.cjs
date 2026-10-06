const express = require("express");

const {
    GetAllCategory,
    GetCategoryByID,
    CreateCategory,
    UpdateCategoryByID,
    DeleteCategoryByID,
    uploadCategoryImage,
    ResizeImages,
} = require("../Controllers/CategoryController.cjs");

const {
    getCategoryValidator,
    CreateCategoryValidator,
    UpdateCategoryValidator,
    DeleteCategoryValidator,
} = require("../utils/validators/CategoryValidator.cjs");

const { Protect, IsAllowTo } = require('../Controllers/AuthController.cjs')
const subcategoriesRouter = require("./SubCategoryRouter.cjs");

const router = express.Router();

// CRUD Operations From Category

// ==================== Get All Categories ====================

router.get("/", GetAllCategory);

// ==================== Get Category By ID ====================

router.get(
    "/:id",
    getCategoryValidator,
    GetCategoryByID
);

// ==================== Create Category ====================

router.post(
    "/",
    Protect,
    IsAllowTo('admin', 'manager'),
    uploadCategoryImage,
    CreateCategoryValidator,
    ResizeImages,
    CreateCategory
);

// ==================== Update Category ====================

router.put(
    "/:id",
    Protect,
    IsAllowTo('admin', 'manager'),
    uploadCategoryImage,
    UpdateCategoryValidator,
    ResizeImages,
    UpdateCategoryByID
);

// ==================== Delete Category ====================

router.delete(
    "/:id",
    Protect,
    IsAllowTo('admin','manager'),
    DeleteCategoryValidator,
    DeleteCategoryByID
);

// ==================== Subcategories ====================

router.use(
    "/:categoryId/subcategories",
    subcategoriesRouter
);

module.exports = router;