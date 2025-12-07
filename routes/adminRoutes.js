const express = require('express');
const adminDashboadController = require('../controllers/adminDashboardController')
const router = express.Router();

router.get('/dashboard', adminDashboadController.adminDashboard)

module.exports = router;