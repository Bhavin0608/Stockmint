import { reserveInventory, releaseReservation } from "../services/reservation.service.js";

export const reserve = async (req, res, next) => {
  try {
    const reservation = await reserveInventory(
      req.user._id,
      req.params.variantId,
      req.body.quantity
    );

    return res.status(201).json({
      success: true,
      message: "Inventory reserved successfully",
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

export const release = async (req, res, next) => {
  try {
    const reservation = await releaseReservation(
      req.user._id,
      req.params.reservationId
    );

    return res.status(200).json({
      success: true,
      message: "Reservation released successfully",
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};