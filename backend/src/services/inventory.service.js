import mongoose from "mongoose";
import ProductVariant from "../models/ProductVariant.js";
import Inventory from "../models/Inventory.js";

export const updateInventory = async (
  variantId,
  quantity
) => {
  if (!mongoose.isValidObjectId(variantId)) {
    const error = new Error("Invalid variant ID");
    error.statusCode = 400;
    throw error;
  }

  if (!Number.isInteger(quantity) || quantity < 0) {
    const error = new Error(
      "Quantity must be a non-negative integer"
    );
    error.statusCode = 400;
    throw error;
  }

  const variant = await ProductVariant.findOne({
    _id: variantId,
    isActive: true,
  });

  if (!variant) {
    const error = new Error("Active variant not found");
    error.statusCode = 404;
    throw error;
  }

  const inventory = await Inventory.findOneAndUpdate(
    { variantId },
    {
      $set: {
        quantity,
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );

  return inventory;
};