const express = require('express')
const CategoryController = require('../Controllers/CategoryController.cjs')
const { getCategoryValidator
    , CreateCategoryValidator
    , UpdateCategoryValidator
    , DeleteCategoryValidator
} = require('../utils/validators/CategoryValidator.cjs')

const router = express.Router()

// CRUD Operation From Category
//GetAllCategory
router.get('/api/Category', CategoryController.GetAllCategory)

//GetCategoryByID
router.get('/api/Category/:id', getCategoryValidator, CategoryController.GetCategoryByID)

//CreateCategory
router.post('/api/Category', CreateCategoryValidator, CategoryController.CreateCategory)

//UpdateCategoryByID
router.put('/api/Category/:id', UpdateCategoryValidator, CategoryController.UpdateCategoryByID)

//DeleteCategoryByID
router.delete('/api/Category/:id', DeleteCategoryValidator, CategoryController.DeleteCategoryByID)


module.exports = router