import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeAdmin } from "../middlewares/admin.middleware.js";
import { create, getAll, getOne, update, remove } from "../controllers/product.controller.js";

const router = express.Router();

router.post("/", authenticateUser, authorizeAdmin, create);
router.get("/", getAll);
router.get("/:id", getOne);
router.put("/:id", authenticateUser, authorizeAdmin, update);
router.delete("/:id", authenticateUser, authorizeAdmin, remove);

export default router;