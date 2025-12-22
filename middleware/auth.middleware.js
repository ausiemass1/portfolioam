import passport from "passport";

//local login
const localLogin = passport.authenticate("local", {
  successRedirect: "/admin/dashboard",
  failureRedirect: "/login",
  failureFlash: true, // set true if using connect-flash
});

// Google login (initial redirect)
const googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
  failureRedirect: "/login",
});

// GitHub login (initial redirect)
const githubLogin = passport.authenticate("github", {
  scope: ["user:email"],
  failureRedirect: "/login",
});

// protecting admin routes
const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
};


// middleware/admin.middleware.js
export const requireAdmin = (req, res, next) => {
  if (req.user?.role === "admin") {
    return next();
  }
  return res.redirect("/");
};


export default {
  googleLogin,
  githubLogin,
  localLogin,
  isAuth,
};
