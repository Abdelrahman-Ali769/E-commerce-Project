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

const router = express.Router();

// CRUD Operation From Product

//GetAllProduct
router.get("/", GetAllProducts);

//GetProductByID
router.get("/:id", GetProductValidator, GetProductByID);

//CreateProduct
router.post(
    "/",
    uploadProductImages,
    CreateProductValidator,
    resizeProductImages,
    CreateProduct,
);

//UpdateProductByID
router.put(
    "/:id",
    uploadProductImages,
    UpdateProductValidator,
    resizeProductImages,
    UpdateProductByID,
);

//DeleteProductByID
router.delete("/:id", DeleteProductValidator, DeleteProductByID);

module.exports = router;
