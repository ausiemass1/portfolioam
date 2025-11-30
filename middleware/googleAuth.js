// middleware/googleAuth.js
const passport = require("passport");

// Google login (initial redirect)
exports.googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"]
});

// Google callback (authentication middleware)
exports.googleCallback = (req, res, next) => {
  passport.authenticate("google", { failureRedirect: "/login" })(req, res, next);
};
