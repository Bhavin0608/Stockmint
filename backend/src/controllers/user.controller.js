// here we are getting the profile of the user who is logged in. 
// The authenticateUser middleware will first check if the user is 
// authenticated and then it will call this controller to get the profile of the user.
import { updateUserProfile } from "../services/user.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getProfile = async (req, res, next) => {
  try {
    const user = req.user;

    return new ApiResponse(200, {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
    }).send(res);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await updateUserProfile(req.user._id, req.body);
    return new ApiResponse(200, user, "Profile updated successfully").send(res);
  } 
  catch (error) {
    next(error);
  }
};