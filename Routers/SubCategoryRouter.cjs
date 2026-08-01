const express = require('express')
const SubCategoryController = require('../Controllers/SubCategoryConstroller.cjs')
const { CreateSubCategoryValidator } = require('../utils/validators/SubCategoryValidator.cjs')


const router = express.Router()

//CreateCategory
router.post('/api/SubCategory', CreateSubCategoryValidator, SubCategoryController.CreateSubCategory)




module.exports = router