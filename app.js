// Import dependencies
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");

const app = express();

// --------------------
// VIEW ENGINE SETUP
// --------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Use EJS layouts
app.use(expressLayouts);
app.set("layout", "./layout"); // This tells Express to use views/layout.ejs as the default layout

// --------------------
// MIDDLEWARE
// --------------------
// Parse form data (optional)
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, JS, images) from /public
app.use(express.static(path.join(__dirname, "public")));

// --------------------
// ROUTES
// --------------------

// Home page
app.get("/", (req, res) => {
  res.render("pages/index", { title: "Home Page" });
});

// About page
app.get("/about", (req, res) => {
  res.render("pages/about", { title: "About Us" });
});

// projects page
app.get("/projects", (req, res) => {
  res.render("pages/projects", { title: "Projects" });
});
// login page
app.get("/login", (req, res) => {
  res.render("pages/login", { title: "login" });
});

// logout page
app.get("/logout", (req, res) => {
  res.render("pages/logout", { title: "logout" });
});

// register page
app.get("/register", (req, res) => {
  res.render("pages/register", { title: "register" });
});
// --------------------
// START SERVER
// --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
