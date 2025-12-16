const express = require("express");
const router = express.Router();
const homeController = require("../../controllers/site/home.controller");
const aboutController = require("../../controllers/site/about.controller");
const loginController = require("../../controllers/site/login.controller");
const registerController = require("../../controllers/site/register.controller");
const projectsController = require("../../controllers/site/projects.conroller");

router.get("/", homeController.home);
router.get("/about", aboutController.about);
router.get("/projects", projectsController.projects);
router.get("/login", loginController.login);
router.get("/register", registerController.getRegisterForm);
router.post("/register", registerController.registerUser);

module.exports = router;