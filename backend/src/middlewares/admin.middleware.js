import { ApiResponse } from "../utils/ApiResponse.js";
export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return new ApiResponse(403, null, "Admin access required").send(res);
  }
  next();
};