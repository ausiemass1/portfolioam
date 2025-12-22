import express from "express";
import userController from "../../controllers/users/admin.user.controller.js";
import auth from "../../middleware/auth.middleware.js"


const router = express.Router();

// Define routes
router.get('/seed', userController.seedUsers);
router.get('/', userController.getUsers);
router.get('/delete/:id', userController.deleteUser);
router.get('/edit/:id', userController.editUserForm);
router.get('/logout', userController.logoutUser);
// POST /register
router.post('/register', userController.registerUser);
router.post('/update/:id', userController.updateUser);

export default router;
