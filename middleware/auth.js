import passport from "passport";

//local login 
const localLogin = passport.authenticate("local", {
  successRedirect: "/admin/dashboard",
  failureRedirect: "/login",
  failureFlash: false // set true if using connect-flash
})

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
  localLogin,
}
