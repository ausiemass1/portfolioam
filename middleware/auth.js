const jwt = require("jsonwebtoken");




module.exports = function (req, res, next) {
  const token = req.cookies.token;

  if (!token) return res.redirect("/login");

  try {
    const verified = jwt.verify(token, "MYSECRET");
    req.user = verified;   // now req.user.id is available
    next();
  } catch (err) {
    return res.redirect("/login");
  }
};
