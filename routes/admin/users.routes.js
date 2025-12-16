const express = require('express');
const router = express.Router();
const userController = require('../../controllers/users/admin.user.controller');
const auth = require("../../middleware/auth");

// Define routes
router.get('/seed', userController.seedUsers);
router.get('/', userController.getUsers);
router.get('/delete/:id', userController.deleteUser);
router.get('/edit/:id', userController.editUserForm);
router.get('/logout', userController.logoutUser);
// POST /register
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/update/:id', userController.updateUser);

module.exports = router;
