const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const googleAuth = require("../middleware/googleAuth");
const passport = require('passport');




router.get('/google', googleAuth.googleLogin);
// Logout route
router.get("/logout", authController.logout);

// router.get(
//     "/google/callback",
//     googleAuth.googleCallback,
//     authController.loginSuccess
//   );



  router.get("/google/callback",
  passport.authenticate("google", {
     failureRedirect: "/login"
  }),
  authController.loginSuccess
);

module.exports = router;