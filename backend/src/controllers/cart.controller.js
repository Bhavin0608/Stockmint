import { addToCart, getMyCart, updateCartItem, removeFromCart } from "../services/cart.service.js";

export const addItem = async (req, res, next) => {
  try {
    const cart = await addToCart(
      req.user._id,
      req.body.variantId,
      req.body.quantity
    );

    return res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

export const getCart = async (req, res, next) => {
  try {
    const cart = await getMyCart(req.user._id);

    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

export const updateItem = async (req, res, next) => {
  try {
    const cart = await updateCartItem(
      req.user._id,
      req.params.variantId,
      req.body.quantity
    );

    return res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

export const removeItem = async (req, res, next) => {
  try {
    const cart = await removeFromCart(
      req.user._id,
      req.params.variantId
    );

    return res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};