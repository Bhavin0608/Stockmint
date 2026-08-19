import crypto from "crypto";

// Randomlt=y it genrates a 32 byte random string and convert it to hex format, which is used as a refresh token.
export const generateRefreshToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// And then we create its hash using the SHA-256 algorithm, which is a one-way hashing function
// that converts the input data into a fixed-size string of characters, which is unique to the
// input data. This hash is then stored in the database instead of the actual refresh token,
// for security reasons.
export const hashRefreshToken = (token) => {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};