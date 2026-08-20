import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { create, getAll, getOne, update, remove } from "../controllers/address.controller.js";

const router = express.Router();

router.post("/", authenticateUser, create);
router.get("/", authenticateUser, getAll);
router.get("/:id", authenticateUser, getOne);
router.put("/:id", authenticateUser, update);
router.delete("/:id", authenticateUser, remove);

export default router;