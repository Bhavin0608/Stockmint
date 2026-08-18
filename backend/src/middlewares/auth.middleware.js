import User from "../models/User.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check whether Authorization header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const error = new Error("Authentication required");
      error.statusCode = 401;
      throw error;
    }

    // Extract JWT from: "Bearer <token>"
    const token = authHeader.split(" ")[1];

    // Verify token signature and expiration
    const decoded = verifyAccessToken(token);

    // Get current user state from database
    const user = await User.findById(decoded.userId);

    if (!user) {
      const error = new Error("User no longer exists");
      error.statusCode = 401;
      throw error;
    }

    // Check current account status
    if (user.status !== "active") {
      const error = new Error("Account is blocked");
      error.statusCode = 403;
      throw error;
    }

    // Make authenticated user available to later middleware/controllers
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};