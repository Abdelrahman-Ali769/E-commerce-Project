const express = require('express');

const {
    GetAllSubCategory,
    GetSubCategoryByID,
    CreateSubCategory,
    UpdateSubCategory,
    DeleteSubCategory,
    SetCategoryByID,
    getSubcatByCategoryID,
} = require('../Controllers/SubCategoryConstroller.cjs');

const {
    getSubCategoryValidator,
    CreateSubCategoryValidator,
    UpdateSubCategoryValidator,
    DeleteSubCategoryValidator,
} = require('../utils/validators/SubCategoryValidator.cjs');

const { Protect, IsAllowTo } = require('../Controllers/AuthController.cjs');

const router = express.Router({ mergeParams: true });

// Get all subcategories
router.get('/', getSubcatByCategoryID, GetAllSubCategory);

// Get subcategory by ID
router.get('/:id', getSubCategoryValidator, GetSubCategoryByID);

// Create subcategory
router.post(
    '/',
    Protect,
    IsAllowTo('admin', 'manager'),
    SetCategoryByID,
    CreateSubCategoryValidator,
    CreateSubCategory
);

// Update subcategory by ID
router.put(
    '/:id',
    Protect,
    IsAllowTo('admin', 'manager'),
    UpdateSubCategoryValidator,
    UpdateSubCategory
);

// Delete subcategory by ID
router.delete(
    '/:id',
    Protect,
    IsAllowTo('admin', 'manager'),
    DeleteSubCategoryValidator,
    DeleteSubCategory
);

module.exports = router;
