
//login successful
const loginSuccess  = (req, res) => {
    res.redirect("/admin/dashboard");
  };

  // Logout
  const logout = (req, res) => {
    // Passport logout
    req.logout(function(err) {
      if (err) {
        console.log("Logout error:", err);
        return res.redirect("/products"); // or error page
      }
  
      // Destroy the session
      req.session.destroy(() => {
        // Clear JWT cookie if it exists
        res.clearCookie("token");
  
        // Clear session cookie
        res.clearCookie("connect.sid");
  
        // Redirect to login page
        return res.redirect("/login");
      });
    });
  };
  
  export default {
    loginSuccess,
    logout
  }