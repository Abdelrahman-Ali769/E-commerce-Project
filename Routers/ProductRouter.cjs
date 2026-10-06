const express = require("express");

const {
    GetAllProducts,
    GetProductByID,
    CreateProduct,
    UpdateProductByID,
    DeleteProductByID,
    uploadProductImages,
    resizeProductImages,
} = require("../Controllers/ProductController.cjs");

const {
    GetProductValidator,
    CreateProductValidator,
    UpdateProductValidator,
    DeleteProductValidator,
} = require("../utils/validators/ProductValidator.cjs");

const {
    Protect,
    IsAllowTo
} = require("../Controllers/AuthController.cjs");

const router = express.Router();


// ==================== Get All Products ====================

router.get(
    "/",
    GetAllProducts
);


// ==================== Get Product By ID ====================

router.get(
    "/:id",
    GetProductValidator,
    GetProductByID
);


// ==================== Create Product ====================

router.post(
    "/",
    Protect,
    IsAllowTo("admin", "manager"),
    uploadProductImages,
    CreateProductValidator,
    resizeProductImages,
    CreateProduct
);


// ==================== Update Product ====================

router.put(
    "/:id",
    Protect,
    IsAllowTo("admin", "manager"),
    uploadProductImages,
    UpdateProductValidator,
    resizeProductImages,
    UpdateProductByID
);


// ==================== Delete Product ====================

router.delete(
    "/:id",
    Protect,
    IsAllowTo("admin", "manager"),
    DeleteProductValidator,
    DeleteProductByID
);


module.exports = router;