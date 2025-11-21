const express = require('express');
const router = express.Router();

//Home page
router.get("/", (req, res) => {
  res.render("pages/index", { title: "Home Page" });
});

// About page
router.get("/about", (req, res) => {
  res.render("pages/about", { title: "About Us" });
});

// projects page
router.get("/projects", (req, res) => {
  res.render("pages/projects", { title: "Projects" });
});
// login page
router.get("/login", (req, res) => {
  res.render("pages/login", { title: "login" });
});

// register page
router.get("/register", (req, res) => {
  res.render("pages/register", { title: "register" });
});

module.exports = router;
