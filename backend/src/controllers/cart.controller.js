import { addToCart, getMyCart, updateCartItem, removeFromCart } from "../services/cart.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const addItem = async (req, res, next) => {
  try {
    const cart = await addToCart(req.user._id, req.body.variantId, req.body.quantity);
    return new ApiResponse(200, cart, "Item added to cart successfully").send(res);
  } 
  catch (error) {
    next(error);
  }
};

export const getCart = async (req, res, next) => {
  try {
    const cart = await getMyCart(req.user._id);
    return new ApiResponse(200, cart, "Cart retrieved successfully").send(res);
  } 
  catch (error) {
    next(error);
  }
};

export const updateItem = async (req, res, next) => {
  try {
    const cart = await updateCartItem(req.user._id, req.params.variantId, req.body.quantity);
    return new ApiResponse(200, cart, "Cart item updated successfully").send(res);
  } 
  catch (error) {
    next(error);
  }
};

export const removeItem = async (req, res, next) => {
  try {
    const cart = await removeFromCart(req.user._id, req.params.variantId);
    return new ApiResponse(200, cart, "Item removed from cart successfully").send(res);
  } 
  catch (error) {
    next(error);
  }
};