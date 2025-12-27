//login successful
const loginSuccess = (req, res) => {
  res.redirect("/admin/dashboard");
};


// Logout logic (Passport v0.6+)
export const logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);

    req.session.destroy(() => {
      res.clearCookie("connect.sid"); // IMPORTANT
      res.redirect("/login");
    });
  });
};


export default {
  loginSuccess,
  logout,
};
