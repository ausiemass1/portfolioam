const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/categories/categories.controller')

router.post('/add', categoryController.addCategory)
router.get('/add', categoryController.addCategoryForm)
module.exports = router;