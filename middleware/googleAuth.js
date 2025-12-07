// middleware/googleAuth.js
const passport = require("passport");

// Google login (initial redirect)
exports.googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"]
});

// Goithub login (initial redirect)
exports.githubLogin = passport.authenticate('github', { scope: ['user:email'] });




