export default (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  res.status(403).render('pages/403');
};