import { registerUser } from "../services/auth.service.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await registerUser({
      name,
      email,
      password,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};