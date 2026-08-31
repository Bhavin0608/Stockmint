import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Address from "../models/Address.js";
import ProductVariant from "../models/ProductVariant.js";
import Inventory from "../models/Inventory.js";
import Reservation from "../models/Reservation.js";
import Order from "../models/Order.js";

export const validateCheckoutCart = async (userId) => {
  const cart = await Cart.findOne({ userId });

  if (!cart) {
    const error = new Error("Cart not found");
    error.statusCode = 404;
    throw error;
  }

  if (cart.items.length === 0) {
    const error = new Error("Cart is empty");
    error.statusCode = 400;
    throw error;
  }

  return cart;
};

export const validateCheckoutAddress = async (
  userId,
  addressId
) => {
  if (!mongoose.isValidObjectId(addressId)) {
    const error = new Error("Invalid address ID");
    error.statusCode = 400;
    throw error;
  }

  const address = await Address.findOne({
    _id: addressId,
    userId,
  });

  if (!address) {
    const error = new Error("Address not found");
    error.statusCode = 404;
    throw error;
  }

  return address;
};

export const prepareOrderItems = async (cart) => {
  const orderItems = [];
  let subtotal = 0;

  for (const item of cart.items) {
    const variant = await ProductVariant.findOne({
      _id: item.variantId,
      isActive: true,
    }).populate("productId", "name");

    if (!variant) {
      const error = new Error(
        "One or more products in the cart are no longer available"
      );
      error.statusCode = 400;
      throw error;
    }

    const itemTotal = variant.price * item.quantity;

    orderItems.push({
      variantId: variant._id,
      productName: variant.productId.name,
      sku: variant.sku,
      attributes: Object.fromEntries(variant.attributes || []),
      quantity: item.quantity,
      unitPrice: variant.price,
    });

    subtotal += itemTotal;
  }

  return {
    orderItems,
    subtotal,
  };
};

export const reserveInventoryForCheckout = async (
  userId,
  orderItems
) => {
  const reservations = [];

  try {
    for (const item of orderItems) {
      const inventory = await Inventory.findOneAndUpdate(
        {
          variantId: item.variantId,
          $expr: {
            $gte: [
              {
                $subtract: [
                  "$quantity",
                  "$reservedQuantity",
                ],
              },
              item.quantity,
            ],
          },
        },
        {
          $inc: {
            reservedQuantity: item.quantity,
          },
        },
        {
          new: true,
        }
      );

      if (!inventory) {
        throw new Error(
          `Insufficient inventory for variant ${item.variantId}`
        );
      }

      const reservation = await Reservation.create({
        userId,
        variantId: item.variantId,
        quantity: item.quantity,
        status: "active",
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      });

      reservations.push(reservation);
    }

    return reservations;
  } catch (error) {// Most important part is to roll back any reservations that were successfully created before the error occurred. This ensures that the inventory remains accurate and prevents over-reservation of stock.
    // Roll back reservations already created
    for (const reservation of reservations) {
      await Inventory.findOneAndUpdate(
        {
          variantId: reservation.variantId,
          reservedQuantity: {
            $gte: reservation.quantity,
          },
        },
        {
          $inc: {
            reservedQuantity: -reservation.quantity,
          },
        }
      );

      await Reservation.findByIdAndDelete(
        reservation._id
      );
    }

    throw error;
  }
};

export const createPendingOrder = async (
  userId,
  orderItems,
  address,
  subtotal
) => {
  const shippingAddress = {
    fullName: address.fullName,
    phone: address.phone,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2 || "",
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country,
  };

  const order = await Order.create({
    userId,
    items: orderItems,
    shippingAddress,
    subtotal,
    totalAmount: subtotal,
    status: "pending",
    paymentStatus: "pending",
  });

  return order;
};