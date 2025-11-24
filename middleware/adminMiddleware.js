// middlewares/adminMiddleware.js
export const adminMiddleware = (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admin only" });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: "Internal error" });
  }
};
