import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { getProfile, updateProfile } from "../controllers/user.controller.js";

const router = express.Router();

// here if authentication is successful, the getProfile controller will be called else the error will be handled by the authenticateUser middleware
router.get("/profile", authenticateUser, getProfile); 
router.put("/profile", authenticateUser, updateProfile);

export default router;