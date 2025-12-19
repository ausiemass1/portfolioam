import express from "express";
const router = express.Router();

import productController from "../controllers/products/user.product.controller.js";

router.get('/',  productController.displayProducts);
export default router;
