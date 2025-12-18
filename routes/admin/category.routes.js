const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/categories/categories.controller')

router.post('/addcategory', categoryController.addCategory)
router.get('/addcategory', categoryController.addCategoryForm)
module.exports = router;