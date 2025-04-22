export const authorizeUser = (req, res, next) => {
  const { userId } = req.params;

  if (req.user?.role === 'admin') {
    return next();
  }

  if (req.user?.id === userId) {
    return next();
  }
  return res.status(403).json({ error: "Access denied" });
};
