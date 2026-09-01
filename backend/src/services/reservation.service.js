import mongoose from "mongoose";
import Inventory from "../models/Inventory.js";
import ProductVariant from "../models/ProductVariant.js";
import Reservation from "../models/Reservation.js";

const RESERVATION_DURATION_MS = 15 * 60 * 1000;

export const reserveInventory = async (
  userId,
  variantId,
  quantity
) => {
  if (!mongoose.isValidObjectId(variantId)) {
    const error = new Error("Invalid variant ID");
    error.statusCode = 400;
    throw error;
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    const error = new Error(
      "Quantity must be a positive integer"
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
    const error = new Error("Insufficient inventory");
    error.statusCode = 409;
    throw error;
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
    const error = new Error("Invalid reservation ID");
    error.statusCode = 400;
    throw error;
  }

  const reservation = await Reservation.findOne({
    _id: reservationId,
    userId,
    status: "active",
  });

  if (!reservation) {
    const error = new Error("Active reservation not found");
    error.statusCode = 404;
    throw error;
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
    const error = new Error(
      "Unable to release reserved inventory"
    );
    error.statusCode = 409;
    throw error;
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
      console.error(
        `Failed to release inventory for reservation ${reservation._id}`
      );

      continue;
    }

    reservation.status = "expired";
    await reservation.save();
  }

  return expiredReservations.length;
};
