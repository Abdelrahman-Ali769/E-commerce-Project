const express = require('express')
const CategoryController =require('../Controllers/CategoryController.cjs')
const router =express.Router()

// CRUD Operation From Category
router.get('/api/Category',CategoryController.GetAllCategory)

router.get('/api/Category/:id',CategoryController.GetCategoryByID)

router.post('/api/Category',CategoryController.CreateCategory)

router.put('/api/Category/:id',CategoryController.UpdateCategoryByID)

router.delete('/api/Category/:id',CategoryController.DeleteCategoryByID)

module.exports =router