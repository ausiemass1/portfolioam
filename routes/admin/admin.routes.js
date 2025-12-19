import express from 'express';
const router = express.Router();

import requireAuth from '../../middleware/auth.middleware.js';
import requireAdmin from '../../middleware/admin.middleware.js';

import userRoutes from './users.routes.js';
import productRoutes from './products.routes.js';
import categoryRoutes from './category.routes.js';
import adminDashboardController from '../../controllers/adminDashboardController.js';
/**
 * Apply auth + admin check to ALL admin routes
 */
// router.use(requireAuth);
// router.use(requireAdmin);

// GET /admin/dashboard
router.get('/dashboard', adminDashboardController.adminDashboard);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);

export default router;
