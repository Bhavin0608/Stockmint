import jwt from "jsonwebtoken";

const JWT_EXPIRES_IN = "15m";

export const generateAccessToken = (user) =>{
    //jwt.sign(payload, secretOrPrivateKey, [options, callback])
  return jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};