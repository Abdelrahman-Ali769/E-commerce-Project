const express = require('express')
const CategoryController =require('../Controllers/CategoryController.cjs')
const router =express.Router()

// CRUD Operation From Category
//GetAllCategory
router.get('/api/Category',CategoryController.GetAllCategory)

//GetCategoryByID
router.get('/api/Category/:id',CategoryController.GetCategoryByID)

//CreateCategory
router.post('/api/Category',CategoryController.CreateCategory)

//UpdateCategoryByID
router.put('/api/Category/:id',CategoryController.UpdateCategoryByID)

//DeleteCategoryByID
router.delete('/api/Category/:id',CategoryController.DeleteCategoryByID)


module.exports =router