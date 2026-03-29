export const verifyAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized request" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied, admin only" });
    }

    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
};
