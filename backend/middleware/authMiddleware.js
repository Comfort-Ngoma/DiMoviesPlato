// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found." });

    req.user = {
      id: user._id.toString(),
      email: user.email,
      subscription: user.subscription,
    };

    next();
  } catch (err) {
    res.status(401).json({ message: "Token verification failed." });
  }
};

export const requireSubscription = (allowedPlans = ["Premium", "Family"]) => {
  return (req, res, next) => {
    const { plan, status, expiresAt } = req.user.subscription || {};
    const isActive =
      status === "active" && (!expiresAt || new Date(expiresAt) > new Date());
    const isAllowed = allowedPlans.includes(plan);

    if (isActive && isAllowed) {
      return next();
    } else {
      return res
        .status(403)
        .json({ message: "This feature requires a premium subscription." });
    }
  };
};
