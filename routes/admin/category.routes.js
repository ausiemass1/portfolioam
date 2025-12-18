const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/categories/categories.controller')

router.get('/', categoryController.displayCategories);
router.post('/addcategory', categoryController.addCategory);
router.get('/addcategory', categoryController.addCategoryForm);

router.get("/edit/:id", categoryController.updateCategoryForm);
router.post("/edit/:id", categoryController.updateCategory);
router.get("/delete/:id", categoryController.deleteCategory);

module.exports = router;
