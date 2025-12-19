import express from "express";
import adminDashboadController from "../../controllers/adminDashboardController.js";
import adminProductController from "../../controllers/products/admin.product.controller.js";
import multer from "multer";

const router = express.Router();

//const upload = multer({ storage });
const upload = multer({ storage: multer.memoryStorage() });

router.get("/dashboard", adminDashboadController.adminDashboard);
router.get("/", adminProductController.displayProducts);
router.get("/addproduct", adminProductController.addProductform);
router.get("/:id/edit", adminProductController.editProductForm);
router.get("/:id/delete", adminProductController.deleteProduct);

router.post("/addproduct", upload.array("images", 5), adminProductController.addProduct);
router.post("/:id", upload.array("images", 5), adminProductController.updateProduct);

export default router;
