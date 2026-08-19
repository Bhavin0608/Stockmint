import User from "../models/User.js";
import RefreshSession from "../models/RefreshSession.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateAccessToken } from "../utils/jwt.js";
import { generateRefreshToken, hashRefreshToken } from "../utils/refreshToken.js";

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

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+passwordHash");

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  if (user.status !== "active") {
    const error = new Error("Account is blocked");
    error.statusCode = 403;
    throw error;
  }

  const isPasswordValid = await comparePassword(
    password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }
  // Generate access token and refresh token for the user.
  const { token: accessToken } = generateAccessToken(user);
  console.log("Access token exists:", !!accessToken);

  const refreshToken = generateRefreshToken();
  const tokenHash = hashRefreshToken(refreshToken);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  // Set in the database.
  await RefreshSession.create({
    userId: user._id,
    tokenHash,
    expiresAt,
  });
  
  // Return the tokens and user information to the client.
  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  };
};

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    const error = new Error("Refresh token required");
    error.statusCode = 401;
    throw error;
  }

  const tokenHash = hashRefreshToken(refreshToken);

  const session = await RefreshSession.findOneAndDelete({
    tokenHash,
    expiresAt: { $gt: new Date() }, // Ensure the refresh token is not expired
  });

  if (!session) {
    const error = new Error("Invalid or expired refresh token");
    error.statusCode = 401;
    throw error;
  }

  if (session.expiresAt <= new Date()) {
    const error = new Error("Refresh token has expired");
    error.statusCode = 401;
    throw error;
  }

  const user = await User.findById(session.userId);

  if (!user) {
    const error = new Error("User no longer exists");
    error.statusCode = 401;
    throw error;
  }

  if (user.status !== "active") {
    const error = new Error("Account is blocked");
    error.statusCode = 403;
    throw error;
  }

  // Generate a completely new refresh token.
  const newRefreshToken = generateRefreshToken();
  const newTokenHash = hashRefreshToken(newRefreshToken);

  const newExpiresAt = new Date();
  newExpiresAt.setDate(newExpiresAt.getDate() + 7);

  await RefreshSession.create({
    userId: user._id,
    tokenHash: newTokenHash,
    expiresAt: newExpiresAt,
  });

  // Generate a new access token.
  const { token: accessToken } = generateAccessToken(user);

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

export const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    const error = new Error("Refresh token required");
    error.statusCode = 401;
    throw error;
  }

  const tokenHash = hashRefreshToken(refreshToken);
  await RefreshSession.deleteOne({ tokenHash });

  return true;
};