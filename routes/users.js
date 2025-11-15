const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Define routes
router.get('/seed', userController.seedUsers);
router.get('/', userController.getUsers);
// POST /register
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);



module.exports = router;
