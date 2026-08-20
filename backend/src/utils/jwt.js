import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_EXPIRES_IN = "1d";

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

export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};