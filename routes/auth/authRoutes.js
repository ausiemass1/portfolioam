const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth/authController");
const googleAuth = require("../../middleware/googleAuth");
const passport = require("passport");

//redirect to google
router.get("/google", googleAuth.googleLogin);

//redirect to github
router.get("/github", googleAuth.githubLogin);

//login with google
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  authController.loginSuccess
);

//login with github
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
  }),
  authController.loginSuccess
);

// Logout route
router.get("/logout", authController.logout);
module.exports = router;
