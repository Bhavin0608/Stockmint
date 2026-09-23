import mongoose from "mongoose";
import ProductVariant from "../models/ProductVariant.js";
import Inventory from "../models/Inventory.js";
import { ApiError } from "../utils/ApiError.js";

export const updateInventory = async (
  variantId,
  quantity
) => {
  if (!mongoose.isValidObjectId(variantId)) {
    throw new ApiError(400, "Invalid variant ID");
  }

  if (!Number.isInteger(quantity) || quantity < 0) {
    throw new ApiError(400, "Quantity must be a non-negative integer");
  }

  const variant = await ProductVariant.findOne({
    _id: variantId,
    isActive: true,
  });

  if (!variant) {
    throw new ApiError(404, "Active variant not found");
  }

  const inventory = await Inventory.findOneAndUpdate(
    { variantId },
    {
      $set: {
        quantity,
      },
    },
    {
      returnDocument: "after",
      upsert: true,
      runValidators: true,
    }
  );

  return inventory;
};