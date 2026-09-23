import { reserveInventory, releaseReservation } from "../services/reservation.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const reserve = async (req, res, next) => {
  try {
    const reservation = await reserveInventory(req.user._id, req.params.variantId, req.body.quantity);
    return new ApiResponse(201, reservation, "Inventory reserved successfully").send(res);
  } 
  catch (error) {
    next(error);
  }
};

export const release = async (req, res, next) => {
  try {
    const reservation = await releaseReservation(req.user._id, req.params.reservationId);
    return new ApiResponse(200, reservation, "Reservation released successfully").send(res);
  } 
  catch (error) {
    next(error);
  }
};