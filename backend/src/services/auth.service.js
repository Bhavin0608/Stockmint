import User from "../models/User.js";
import { hashPassword } from "../utils/password.js";

export const registerUser = async ({ name, email, password }) => {
  // Normalize the email before checking/storing it.
  const normalizedEmail = email.trim().toLowerCase();

  // Application-level check for a better user-facing error.
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }

  // Never store the plain-text password.
  const passwordHash = await hashPassword(password);

  // Role and status are controlled by the server.
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: "customer",
    status: "active",
  });

  // Don't return sensitive information such as passwordHash.
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
  };
};