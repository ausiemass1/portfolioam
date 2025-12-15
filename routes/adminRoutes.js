const express = require('express');
const adminDashboadController = require('../controllers/adminDashboardController')
const productCntroller = require('../controllers/productController')
const router = express.Router();

router.get('/dashboard', adminDashboadController.adminDashboard)
router.get('/products', productCntroller.displayProducts )

module.exports = router;