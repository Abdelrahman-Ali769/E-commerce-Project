const express = require('express')
const SubCategoryController = require('../Controllers/SubCategoryConstroller.cjs')
const { getSubCategoryValidator, CreateSubCategoryValidator,UpdateSubCategoryValidator,DeleteSubCategoryValidator } = require('../utils/validators/SubCategoryValidator.cjs')


const router = express.Router({mergeParams: true})

// Get SubCategory 
router.get('/', SubCategoryController.GetAllSubCategory)

//GetSubCategoryByID
router.get('/:id', getSubCategoryValidator, SubCategoryController.GetSubCategoryByID)

//CreateCategory
router.post('/', CreateSubCategoryValidator, SubCategoryController.CreateSubCategory)

//UpdateCategoryByID
router.put('/:id', UpdateSubCategoryValidator, SubCategoryController.UpdateSubCategory)

//DeleteCategoryByID
router.delete('/:id', DeleteSubCategoryValidator, SubCategoryController.DeleteSubCategory)


module.exports = router