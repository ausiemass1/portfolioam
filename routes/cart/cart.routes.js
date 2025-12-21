import express from "express";
import cartController from "../../controllers/cart/cart.controller.js";
const router = express.Router();

router.get("/", cartController.cartDisplay);
router.post("/add/:productId", cartController.cartAdd);
router.post("/decrement/:productId", cartController.cartDecrement);
router.post("/remove/:productId", cartController.cartRemove);
router.post("/clear", cartController.clearCart);

export default router;
