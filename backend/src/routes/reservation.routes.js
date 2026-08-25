import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { reserve, release } from "../controllers/reservation.controller.js";

const router = express.Router();

router.post("/:variantId/reserve", authenticateUser, reserve);
router.post("/:reservationId/release", authenticateUser, release);

export default router;