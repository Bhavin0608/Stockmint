import { updateInventory } from "../services/inventory.service.js";

export const update = async (req, res, next) => {
  try {
    const inventory = await updateInventory(
      req.params.variantId,
      req.body.quantity
    );

    return res.status(200).json({
      success: true,
      message: "Inventory updated successfully",
      data: inventory,
    });
  } catch (error) {
    next(error);
  }
};