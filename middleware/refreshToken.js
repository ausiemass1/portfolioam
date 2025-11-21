module.exports = function (req, res, next) {
    if (req.cookies.token) {
      // Refresh cookie every time user is active
      res.cookie("token", req.cookies.token, {
        httpOnly: true,
        maxAge: 2 * 60 * 1000, // reset 30 seconds
      });
    }
    next();
  };
  