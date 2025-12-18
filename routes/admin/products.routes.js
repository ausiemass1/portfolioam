const express = require("express");
const adminDashboadController = require("../../controllers/adminDashboardController");
const adminProductController = require("../../controllers/products/admin.product.controller");
const router = express.Router();
const multer = require('multer');

//const upload = multer({ storage });
const upload = multer({ storage: multer.memoryStorage() });

router.get("/dashboard", adminDashboadController.adminDashboard);
router.get("/", adminProductController.displayProducts);
router.get("/addproduct", adminProductController.addProductform);
router.get("/:id/edit", adminProductController.editProductForm);
router.get("/:id/delete", adminProductController.deleteProduct);

router.post("/addproduct", upload.array("images", 5), adminProductController.addProduct);
router.post("/:id", upload.array("images", 5), adminProductController.updateProduct);

module.exports = router;
