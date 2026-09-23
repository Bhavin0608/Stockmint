import { updateInventory } from "../services/inventory.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const update = async (req, res, next) => {
  try {
    const inventory = await updateInventory(req.params.variantId, req.body.quantity);
    return new ApiResponse(200, inventory, "Inventory updated successfully").send(res);
  } 
  catch (error) {
    next(error);
  }
};