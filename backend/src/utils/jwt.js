import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_EXPIRES_IN = "10m";

export const generateAccessToken = (user) => {
  const jti = crypto.randomUUID(); // Generate a unique identifier for the token. This is used to identify the token in the database and can be used for revocation or tracking purposes.

  const token = jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
      jwtid: jti,
    }
  );

  return {
    token,
    jti,
  };
};

// This function verifies the access token using the secret key. If the token is valid, it returns the decoded payload. If the token is invalid or expired, it throws an error with a 401 status code.
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    const authError = new Error("Invalid or expired access token");
    authError.statusCode = 401;

    throw authError;
  }
};