import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import ProductVariant from "../models/ProductVariant.js";
import { ApiError } from "../utils/ApiError.js";

export const addToCart = async (
  userId,
  variantId,
  quantity
) => {
  if (!mongoose.isValidObjectId(variantId)) {
    throw new ApiError(400, "Invalid variant ID");
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new ApiError(400, "Quantity must be a positive integer");
  }

  const variant = await ProductVariant.findOne({
    _id: variantId,
    isActive: true,
  });

  if (!variant) {
    throw new ApiError(404, "Active variant not found");
  }

  // is user have cart or not
  let cart = await Cart.findOne({ userId });

  // if not then create one and add the item to it
  if (!cart) {
    cart = await Cart.create({
      userId,
      items: [
        {
          variantId,
          quantity,
        },
      ],
    });

    return cart;
  }

  // if exist then check if the item is already in the cart
  const existingItem = cart.items.find(
    (item) => item.variantId.toString() === variantId
  );

  // if it is, then update the quantity, otherwise add the new item
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      variantId,
      quantity,
    });
  }

  await cart.save();

  return cart;
};

export const getMyCart = async (userId) => {
  const cart = await Cart.findOne({ userId })
    .populate({ // using populate to get the details of the product variant and its associated product
      path: "items.variantId",
      select: "sku price compareAtPrice attributes productId",
      populate: {
        path: "productId",
        select: "name",
      },
    });

  if (!cart) {
    return {
      userId,
      items: [],
    };
  }

  return cart;
};

export const updateCartItem = async (
  userId,
  variantId,
  quantity
) => {
  if (!mongoose.isValidObjectId(variantId)) {
    throw new ApiError(400, "Invalid variant ID");
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new ApiError(400, "Quantity must be a positive integer");
  }

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const item = cart.items.find(
    (item) => item.variantId.toString() === variantId
  );

  if (!item) {
    throw new ApiError(404, "Item not found in cart");
  }

  item.quantity = quantity;

  await cart.save();

  return cart;
};

export const removeFromCart = async (userId, variantId) => {
  if (!mongoose.isValidObjectId(variantId)) {
    throw new ApiError(400, "Invalid variant ID");
  }

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.variantId.toString() === variantId
  );

  if (itemIndex === -1) { // Index does not exist, meaning the item is not in the cart
    throw new ApiError(404, "Item not found in cart");
  }

  cart.items.splice(itemIndex, 1); // remove the item from the cart using splice method

  await cart.save();

  return cart;
};