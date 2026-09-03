const express = require('express')
const { GetAllCategory, GetCategoryByID, CreateCategory, UpdateCategoryByID, DeleteCategoryByID, uploadCategoryImage,ResizeImages } = require('../Controllers/CategoryController.cjs')
const { getCategoryValidator
    , CreateCategoryValidator
    , UpdateCategoryValidator
    , DeleteCategoryValidator
} = require('../utils/validators/CategoryValidator.cjs')

const subcategoriesRouter = require('./SubCategoryRouter.cjs')


const router = express.Router()


// CRUD Operation From Category

//GetAllCategory
router.get('/', GetAllCategory)

//GetCategoryByID
router.get('/:id', getCategoryValidator, GetCategoryByID)

//CreateCategory
router.post('/', uploadCategoryImage,ResizeImages,CreateCategoryValidator, CreateCategory)

//UpdateCategoryByID
router.put('/:id', UpdateCategoryValidator, UpdateCategoryByID)

//DeleteCategoryByID
router.delete('/:id', DeleteCategoryValidator, DeleteCategoryByID)

router.use('/:categoryId/subcategories', subcategoriesRouter)

module.exports = router