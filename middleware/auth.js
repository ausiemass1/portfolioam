const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // If user is logged in with Google OAuth (Passport session)
  if (req.user) {
    return next();
  }

  // Otherwise check JWT token (normal login)
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/login");
  }

  try {
    const verified = jwt.verify(token, "MYSECRET");
    req.user = verified;
    next();
  } catch (err) {
    return res.redirect("/login");
  }
};
