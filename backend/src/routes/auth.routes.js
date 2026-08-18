import express from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

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