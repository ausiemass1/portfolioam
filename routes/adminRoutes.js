const express = require('express');
const adminDashboadController = require('../controllers/adminDashboardController')
const productController = require('../controllers/productController')
const router = express.Router();

router.get('/dashboard', adminDashboadController.adminDashboard)
router.get('/products', productController.displayProducts )
router.get('/products/add', productController.addProductform)
module.exports = router;