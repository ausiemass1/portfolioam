
import express from "express";
import categoryController from "../../controllers/categories/categories.controller.js";

const router = express.Router();

router.get('/', categoryController.displayCategories);
router.post('/addcategory', categoryController.addCategory);
router.get('/addcategory', categoryController.addCategoryForm);

router.get("/edit/:id", categoryController.updateCategoryForm);
router.post("/edit/:id", categoryController.updateCategory);
router.get("/delete/:id", categoryController.deleteCategory);

export default router;
