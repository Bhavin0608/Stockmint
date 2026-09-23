import mongoose from "mongoose";
import Inventory from "../models/Inventory.js";
import ProductVariant from "../models/ProductVariant.js";
import Reservation from "../models/Reservation.js";
import { ApiError } from "../utils/ApiError.js";

const RESERVATION_DURATION_MS = 15 * 60 * 1000;

export const reserveInventory = async (
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

  const expiresAt = new Date(
    Date.now() + RESERVATION_DURATION_MS
  );

  // this is the query which checks if there is enough inventory available and reserves it in one atomic operation.
  const inventory = await Inventory.findOneAndUpdate(
    {
      variantId,
      $expr: {
        $gte: [
          {
            $subtract: [
              "$quantity",
              "$reservedQuantity",
            ],
          },
          quantity,
        ],
      },
    },
    {
      $inc: {
        reservedQuantity: quantity,
      },
    },
    {
      returnDocument: "after",
    }
  );

  if (!inventory) {
    throw new ApiError(409, "Insufficient inventory");
  }

  try {
    const reservation = await Reservation.create({
      userId,
      variantId,
      quantity,
      expiresAt,
    });

    return reservation;
  } catch (error) {
    // Important: reservation creation failed after
    // inventory was already reserved.

    // that's why we have to add error handling here to ensure that the reserved quantity is rolled back in case of an error during reservation creation. This prevents inventory from being incorrectly reserved when the reservation itself fails to be created.
    await Inventory.updateOne(
      { variantId },
      {
        $inc: {
          reservedQuantity: -quantity,
        },
      }
    );

    throw error;
  }
};

export const releaseReservation = async (
  userId,
  reservationId
) => {
  if (!mongoose.isValidObjectId(reservationId)) {
    throw new ApiError(400, "Invalid reservation ID");
  }

  const reservation = await Reservation.findOne({
    _id: reservationId,
    userId,
    status: "active",
  });

  if (!reservation) {
    throw new ApiError(404, "Active reservation not found");
  }

  const inventory = await Inventory.findOneAndUpdate(
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
    },
    {
      returnDocument: "after",
    }
  );

  if (!inventory) {
    throw new ApiError(409, "Unable to release reserved inventory");
  }

  reservation.status = "released";
  await reservation.save();

  return reservation;
};

export const expireReservations = async () => {
  const now = new Date();

  const expiredReservations = await Reservation.find({
    status: "active",
    expiresAt: { $lte: now },
  });

  for (const reservation of expiredReservations) {
    const inventory = await Inventory.findOneAndUpdate(
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
      },
      {
        returnDocument: "after",
      }
    );

    if (!inventory) {
      throw new ApiError(409, "Unable to release reserved inventory for expired reservation");
    }

    reservation.status = "expired";
    await reservation.save();
  }

  return expiredReservations.length;
};
