const express = require('express');
const router = express.Router();

// Admin access middleware
const requireAuth = require('../../middleware/auth.middleware');
const requireAdmin = require('../../middleware/admin.middleware');

// Sub-routers
const userRoutes = require('./users.routes');
const productRoutes = require('./products.routes');

/**
 * Apply auth + admin check to ALL admin routes
 */
// router.use(requireAuth);
// router.use(requireAdmin);

/**
 * Admin dashboard
 * GET /admin
 */
// router.get('/', (req, res) => {
//   res.redirect('/admin/dashboard');
// });

const adminDashboardController = require('../../controllers/adminDashboardController');

// GET /admin/dashboard
router.get('/dashboard', adminDashboardController.adminDashboard);

/**
 * GET /admin/dashboard
 */
// router.get('/dashboard', (req, res) => {
//   res.render('admin/dashboard', {
//     title: 'Admin Dashboard',
//     user: req.user
//   });
// });

/**
 * Mount resource routes
 * /admin/users
 * /admin/products
 */
router.use('/users', userRoutes);
router.use('/products', productRoutes);

module.exports = router;
