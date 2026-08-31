import { validateCheckoutCart, validateCheckoutAddress, prepareOrderItems, reserveInventoryForCheckout, createPendingOrder } from "../services/order.service.js";

export const checkout = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const cart = await validateCheckoutCart(userId);

    const address = await validateCheckoutAddress(
      userId,
      req.body.addressId
    );

    const { orderItems, subtotal } =
      await prepareOrderItems(cart);

    const reservations =
      await reserveInventoryForCheckout(
        userId,
        orderItems
      );

    const order = await createPendingOrder(
      userId,
      orderItems,
      address,
      subtotal
    );

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        order,
        reservations,
      },
    });
  } catch (error) {
    next(error);
  }
};