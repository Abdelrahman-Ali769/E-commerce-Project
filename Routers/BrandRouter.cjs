const express = require('express')
const {GetAllBrand,GetBrandByID,CreateBrand,UpdateBrandByID,DeleteBrandByID} = require('../Controllers/BrandController.cjs')
const { getBrandValidator
    , CreateBrandValidator
    , UpdateBrandValidator
    , DeleteBrandValidator
} = require('../utils/validators/BrandValidator.cjs')



const router = express.Router()


// CRUD Operation From Brand

//GetAllBrand
router.get('/', GetAllBrand)

//GetBrandByID
router.get('/:id', getBrandValidator, GetBrandByID)

//CreateBrand
router.post('/', CreateBrandValidator, CreateBrand)

//UpdateBrandByID
router.put('/:id', UpdateBrandValidator, UpdateBrandByID)

//DeleteBrandByID
router.delete('/:id', DeleteBrandValidator, DeleteBrandByID)

module.exports = router