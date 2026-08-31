import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { checkout } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/checkout", authenticateUser, checkout);

export default router;