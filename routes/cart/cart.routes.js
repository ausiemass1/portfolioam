import express from "express";
import cartController from "../../controllers/cart/cart.controller.js"
const router = express.Router();

router.post("/add/:productId", cartController.cartAdd);

// viewing cart items
router.get("/", cartController.cartDisplay );

export default router;
