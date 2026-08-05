const express = require('express')
const {GetAllProducts,GetProductByID,CreateProduct,UpdateProductByID,DeleteProductByID} = require('../Controllers/ProductController.cjs')
const { GetProductValidator
    , CreateProductValidator
    , UpdateProductValidator
    , DeleteProductValidator
} = require('../utils/validators/ProductValidator.cjs')


const router = express.Router()


// CRUD Operation From Product

//GetAllProduct
router.get('/', GetAllProducts)

//GetProductByID
router.get('/:id', GetProductValidator, GetProductByID)

//CreateProduct
router.post('/', CreateProductValidator, CreateProduct)

//UpdateProductByID
router.put('/:id', UpdateProductValidator, UpdateProductByID)

//DeleteProductByID
router.delete('/:id', DeleteProductValidator, DeleteProductByID)

module.exports = router