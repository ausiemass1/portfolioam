const express = require('express');
const router = express.Router();

// Admin access middleware
const requireAuth = require('../../middleware/auth.middleware');
const requireAdmin = require('../../middleware/admin.middleware');

// Sub-routers
const userRoutes = require('./users.routes');
const productRoutes = require('./products.routes');
const categoryRoutes = require('./category.routes');

/**
 * Apply auth + admin check to ALL admin routes
 */
// router.use(requireAuth);
// router.use(requireAdmin);

const adminDashboardController = require('../../controllers/adminDashboardController');

// GET /admin/dashboard
router.get('/dashboard', adminDashboardController.adminDashboard);

router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);

module.exports = router;
