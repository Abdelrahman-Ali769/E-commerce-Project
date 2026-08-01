const express = require('express')
const SubCategoryController = require('../Controllers/SubCategoryConstroller.cjs')
const { getSubCategoryValidator, CreateSubCategoryValidator,UpdateSubCategoryValidator,DeleteSubCategoryValidator } = require('../utils/validators/SubCategoryValidator.cjs')


const router = express.Router()

// Get SubCategory 
router.get('/api/SubCategory', SubCategoryController.GetAllSubCategory)

//GetSubCategoryByID
router.get('/api/SubCategory/:id', getSubCategoryValidator, SubCategoryController.GetSubCategoryByID)

//CreateCategory
router.post('/api/SubCategory', CreateSubCategoryValidator, SubCategoryController.CreateSubCategory)

//UpdateCategoryByID
router.put('/api/SubCategory/:id', UpdateSubCategoryValidator, SubCategoryController.UpdateSubCategory)

//DeleteCategoryByID
router.delete('/api/SubCategory/:id', DeleteSubCategoryValidator, SubCategoryController.DeleteSubCategory)


module.exports = router