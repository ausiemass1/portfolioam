import express from "express";

const router = express.Router();

import homeController from "../../controllers/site/home.controller.js";
import aboutController from "../../controllers/site/about.controller.js";
import loginController from "../../controllers/site/login.controller.js";
import registerController from "../../controllers/site/register.controller.js";
import projectsController from "../../controllers/site/projects.conroller.js";

router.get("/", homeController.home);
router.get("/contact", aboutController.contact);
router.get("/projects", projectsController.projects);
router.get("/login", loginController.login);
router.get("/register", registerController.getRegisterForm);
router.post("/register", registerController.registerUser);

export default router;