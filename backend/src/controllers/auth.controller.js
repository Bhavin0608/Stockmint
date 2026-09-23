import { registerUser, loginUser, refreshAccessToken, logoutUser,} from "../services/auth.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await registerUser({name, email, password,});
    return new ApiResponse(201, user, "User registered successfully").send(res);
  } 
  catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser({email, password,});

    res.cookie("refreshToken", result.refreshToken, { // this are the security settings. object
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    const data = {
      accessToken: result.accessToken, 
      user: result.user,
    };

    return new ApiResponse(200, data, "Login successful").send(res);
  } 
  catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const result = await refreshAccessToken(refreshToken);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return new ApiResponse(200, { accessToken: result.accessToken }, "Access token refreshed successfully").send(res);
  } 
  catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    await logoutUser(refreshToken);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return new ApiResponse(200, null, "Logout successful").send(res);
  } 
  catch (error) {
    next(error);
  }
};