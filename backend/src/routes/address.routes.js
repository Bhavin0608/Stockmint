import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { create } from "../controllers/address.controller.js";

const router = express.Router();

router.post("/", authenticateUser, create);

export default router;