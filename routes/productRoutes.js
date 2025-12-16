const express = require('express');
const router = express.Router();
const productController = require('../controllers/products/user.product.controller');
router.get('/',  productController.displayProducts);
module.exports = router;
