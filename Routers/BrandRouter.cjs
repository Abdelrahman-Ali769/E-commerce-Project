const express = require("express");

const {
    GetAllBrand,
    GetBrandByID,
    CreateBrand,
    UpdateBrandByID,
    DeleteBrandByID,
    uploadBrandImage,
    ResizeImages,
} = require("../Controllers/BrandController.cjs");

const {
    getBrandValidator,
    CreateBrandValidator,
    UpdateBrandValidator,
    DeleteBrandValidator,
} = require("../utils/validators/BrandValidator.cjs");

const { Protect, IsAllowTo } = require('../Controllers/AuthController.cjs')

const router = express.Router();

// CRUD Operations From Brand

// ==================== Get All Brands ====================

router.get(
    "/",
    GetAllBrand
);

// ==================== Get Brand By ID ====================

router.get(
    "/:id",
    getBrandValidator,
    GetBrandByID
);

// ==================== Create Brand ====================

router.post(
    "/",
    Protect,
    IsAllowTo('admin', 'manager'),
    uploadBrandImage,
    CreateBrandValidator,
    ResizeImages,
    CreateBrand
);

// ==================== Update Brand ====================

router.put(
    "/:id",
    Protect,
    IsAllowTo('admin','manager'),
    uploadBrandImage,
    UpdateBrandValidator,
    ResizeImages,
    UpdateBrandByID
);

// ==================== Delete Brand ====================

router.delete(
    "/:id",
    Protect,
    IsAllowTo('admin','manager'),
    DeleteBrandValidator,
    DeleteBrandByID
);

module.exports = router;