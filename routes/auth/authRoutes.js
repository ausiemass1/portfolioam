import express from "express";
import authController from "../../controllers/auth/authController.js";
import googleAuth from "../../middleware/googleAuth.js";
import passport from "passport";

const router = express.Router();

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
export default router;
