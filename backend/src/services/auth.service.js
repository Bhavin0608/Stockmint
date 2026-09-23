import User from "../models/User.js";
import RefreshSession from "../models/RefreshSession.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateAccessToken } from "../utils/jwt.js";
import { generateRefreshToken, hashRefreshToken } from "../utils/refreshToken.js";
import { ApiError } from "../utils/ApiError.js";

export const registerUser = async ({ name, email, password }) => {
  // Normalize the email before checking/storing it.
  const normalizedEmail = email.trim().toLowerCase();

  // Application-level check for a better user-facing error.
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new ApiError(409, "Email is already registered");
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
    throw new ApiError(401, "Invalid email or password");
  }

  if (user.status !== "active") {
    throw new ApiError(403, "Account is blocked");
  }

  const isPasswordValid = await comparePassword(
    password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
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
    throw new ApiError(401, "Refresh token required");
  }

  const tokenHash = hashRefreshToken(refreshToken);

  const session = await RefreshSession.findOneAndDelete({
    tokenHash,
    expiresAt: { $gt: new Date() }, // Ensure the refresh token is not expired
  });

  if (!session) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  if (session.expiresAt <= new Date()) {
    throw new ApiError(401, "Refresh token has expired");
  }

  const user = await User.findById(session.userId);

  if (!user) {
    throw new ApiError(401, "User no longer exists");
  }

  if (user.status !== "active") {
    throw new ApiError(403, "Account is blocked");
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
    throw new ApiError(401, "Refresh token required");
  }

  const tokenHash = hashRefreshToken(refreshToken);
  await RefreshSession.deleteOne({ tokenHash });

  return true;
};