//login successful
const loginSuccess = (req, res) => {
  res.redirect("/admin/dashboard");
};

// Logout logic
const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log("Logout error:", err);
      return res.redirect("/products"); // or error page
    }

    req.session.destroy(() => {
      return res.redirect("/login");
    });
  });
};

export default {
  loginSuccess,
  logout,
};
