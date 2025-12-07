const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require("../middleware/auth");
const path = require('path');


const multer = require('multer');

//const upload = multer({ storage });
const upload = multer({ storage: multer.memoryStorage() });

// Add product route
router.post('/addproduct', upload.single('image'), productController.addProduct);
router.get('/addproduct', productController.addProductform)
// Define routes
router.get('/',  productController.displayProducts);
router.get('/delete/:id', productController.deleteProduct);
router.get('/edit/:id', productController.editProductForm);

// POST 
router.post('/update/:id', upload.single('image'), productController.updateProduct);

module.exports = router;
