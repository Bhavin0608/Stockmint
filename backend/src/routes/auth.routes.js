import express from 'express';
import { register, login, refresh, logout } from '../controllers/auth.controller.js';
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout); // here authenticateUser middleware is not used because the user may not be logged in when they want to log out. The refresh token is used to identify the user and log them out.

//For testing the authentication middleware
router.get("/test-protected", authenticateUser, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authentication successful",
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

export default router;