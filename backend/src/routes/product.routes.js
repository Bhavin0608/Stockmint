import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeAdmin } from "../middlewares/admin.middleware.js";
import { create, getAll, getOne, update, remove } from "../controllers/product.controller.js";

// product variants routes are stay here.
import { variantcreate, variantgetAll, variantgetOne, variantupdate, variantremove } from "../controllers/productVariant.controller.js";

const router = express.Router();

router.post("/", authenticateUser, authorizeAdmin, create);
router.get("/", getAll);
router.get("/:id", getOne);
router.put("/:id", authenticateUser, authorizeAdmin, update);
router.delete("/:id", authenticateUser, authorizeAdmin, remove);

// product variants routes
router.post("/:productId/variants", authenticateUser, authorizeAdmin, variantcreate);
router.get("/:productId/variants", variantgetAll);
router.get("/:productId/variants/:variantId", variantgetOne);
router.patch("/:productId/variants/:variantId", authenticateUser, authorizeAdmin, variantupdate);
router.delete("/:productId/variants/:variantId", authenticateUser, authorizeAdmin, variantremove);

export default router;