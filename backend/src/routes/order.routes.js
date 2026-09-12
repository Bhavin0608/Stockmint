import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { checkout, cancel, getOrders, getOrderByIdController } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/checkout", authenticateUser, checkout);
router.patch("/cancel/:orderId", authenticateUser, cancel);
router.get("/", authenticateUser, getOrders);
router.get("/:orderId", authenticateUser, getOrderByIdController);

// Admin routes

export default router;