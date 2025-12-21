import express from "express";
import authController from "../../controllers/auth/authController.js";
import auth from "../../middleware/auth.middleware.js";
import passport from "passport";
//import auth from "../middleware/auth.middleware.js";

const router = express.Router();
router.post("/login", auth.localLogin);

//redirect to google
router.get("/google", auth.googleLogin);//login with google
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  authController.loginSuccess
);

//redirect to github
router.get("/github", auth.githubLogin);

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
