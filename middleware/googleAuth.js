import passport from "passport";

// Google login (initial redirect)
const googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// GitHub login (initial redirect)
const githubLogin = passport.authenticate("github", {
  scope: ["user:email"],
});

export default {
  googleLogin,
  githubLogin,
}
