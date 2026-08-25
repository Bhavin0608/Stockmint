import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeAdmin } from "../middlewares/admin.middleware.js";
import { update } from "../controllers/inventory.controller.js";

const router = express.Router();

router.patch("/:variantId", authenticateUser, authorizeAdmin, update);

export default router;