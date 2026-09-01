//import { validateCheckoutCart, validateCheckoutAddress, prepareOrderItems, reserveInventoryForCheckout, createPendingOrder } from "../services/order.service.js";
import { processCheckout } from "../services/order.service.js";

export const checkout = async (req, res, next) => {
  try {
    const result = await processCheckout(
      req.user._id,
      req.body.addressId
    );

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};