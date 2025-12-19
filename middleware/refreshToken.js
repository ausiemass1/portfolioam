// middleware/refreshToken.js
export default function refreshToken(req, res, next) {
  // Only refresh JWT for JWT users, not Google OAuth
  if (req.cookies.token) {
    res.cookie("token", req.cookies.token, {
      httpOnly: true,
      maxAge: 2 * 60 * 1000, // 2 minutes
    });
  }
  next();
}
