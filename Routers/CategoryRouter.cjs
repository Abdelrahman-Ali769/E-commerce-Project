const express = require('express')
const CategoryController = require('../Controllers/CategoryController.cjs')
const { getCategoryValidator
    , CreateCategoryValidator
    , UpdateCategoryValidator
    , DeleteCategoryValidator
} = require('../utils/validators/CategoryValidator.cjs')

const subcategoriesRouter = require('./SubCategoryRouter.cjs')


const router = express.Router()


// CRUD Operation From Category

//GetAllCategory
router.get('/', CategoryController.GetAllCategory)

//GetCategoryByID
router.get('/:id', getCategoryValidator, CategoryController.GetCategoryByID)

//CreateCategory
router.post('/', CreateCategoryValidator, CategoryController.CreateCategory)

//UpdateCategoryByID
router.put('/:id', UpdateCategoryValidator, CategoryController.UpdateCategoryByID)

//DeleteCategoryByID
router.delete('/:id', DeleteCategoryValidator, CategoryController.DeleteCategoryByID)

router.use('/:categoryId/subcategories', subcategoriesRouter)

module.exports = router