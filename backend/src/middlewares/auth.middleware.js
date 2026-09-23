import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check whether Authorization header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Authentication required");
    }

    // Extract JWT from: "Bearer <token>"
    const token = authHeader.split(" ")[1];

    // Verify token signature and expiration
    const decoded = verifyAccessToken(token);

    // Get current user state from database
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new ApiError(401, "User no longer exists");
    }

    // Check current account status
    if (user.status !== "active") {
      throw new ApiError(403, "Account is blocked");
    }

    // Make authenticated user available to later middleware/controllers
    req.user = user;

    next();
  } 
  catch (error) {
    next(error);
  }
};