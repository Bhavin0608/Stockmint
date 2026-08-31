import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { addItem, getCart, updateItem, removeItem } from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/items", authenticateUser, addItem);
router.get("/", authenticateUser, getCart);
router.patch("/items/:variantId", authenticateUser, updateItem);
router.delete("/items/:variantId", authenticateUser, removeItem);

export default router;