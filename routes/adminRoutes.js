const express = require("express");
const adminDashboadController = require("../controllers/adminDashboardController");
const productController = require("../controllers/productController");
const router = express.Router();
const multer = require('multer');

//const upload = multer({ storage });
const upload = multer({ storage: multer.memoryStorage() });

router.get("/dashboard", adminDashboadController.adminDashboard);
router.get("/products", productController.displayProducts);
router.get("/products/addproduct", productController.addProductform);
router.get("/products/edit/:id", productController.addProductform);

router.post("/products/addproduct", upload.array("images", 5), productController.addProduct);

module.exports = router;
