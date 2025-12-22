import express from 'express';
const router = express.Router();

import userRoutes from './users.routes.js';
import productRoutes from './products.routes.js';
import categoryRoutes from './category.routes.js';
import adminDashboardController from '../../controllers/adminDashboardController.js';

import { requireAdmin } from "../../middleware/auth.middleware.js";
import authMiddleware from '../../middleware/auth.middleware.js'
const { isAuth } = authMiddleware;

router.use(isAuth, requireAdmin);
router.get('/dashboard',  adminDashboardController.adminDashboard);
router.use('/users',  userRoutes);
router.use('/products',  productRoutes);
router.use('/categories',  categoryRoutes);

export default router;
