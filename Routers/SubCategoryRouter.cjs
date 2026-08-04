const express = require('express')
const {GetAllSubCategory,GetSubCategoryByID,CreateSubCategory,UpdateSubCategory,DeleteSubCategory,SetCategoryByID,getSubcatByCategoryID} = require('../Controllers/SubCategoryConstroller.cjs')
const { getSubCategoryValidator, CreateSubCategoryValidator,UpdateSubCategoryValidator,DeleteSubCategoryValidator } = require('../utils/validators/SubCategoryValidator.cjs')


const router = express.Router({mergeParams: true})

// Get SubCategory 
router.get('/', getSubcatByCategoryID,GetAllSubCategory)

//GetSubCategoryByID
router.get('/:id', getSubCategoryValidator,GetSubCategoryByID)

//CreateCategory
router.post('/', SetCategoryByID,CreateSubCategoryValidator,CreateSubCategory)

//UpdateCategoryByID
router.put('/:id', UpdateSubCategoryValidator,UpdateSubCategory)

//DeleteCategoryByID
router.delete('/:id', DeleteSubCategoryValidator,DeleteSubCategory)


module.exports = router