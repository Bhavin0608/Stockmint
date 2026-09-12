import express from "express";
import { authorizeAdmin } from "../middlewares/admin.middleware.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { getAllOrdersAdmin, getOrderAdminById, updateStatus, adminCancelOrderController } from "../controllers/order.controller.js";

const router = express.Router();

router.get("/", authenticateUser, authorizeAdmin, getAllOrdersAdmin);
router.get("/:orderId", authenticateUser, authorizeAdmin, getOrderAdminById);
router.patch("/:orderId/status", authenticateUser, authorizeAdmin, updateStatus);
router.patch("/:orderId/cancel", authenticateUser, authorizeAdmin, adminCancelOrderController);

export default router;