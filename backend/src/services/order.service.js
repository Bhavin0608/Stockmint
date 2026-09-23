import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Address from "../models/Address.js";
import ProductVariant from "../models/ProductVariant.js";
import Inventory from "../models/Inventory.js";
import Reservation from "../models/Reservation.js";
import Order from "../models/Order.js";
import { ApiError } from "../utils/ApiError.js";

export const validateCheckoutCart = async (userId) => {
  const cart = await Cart.findOne({ userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  if (cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  return cart;
};

export const validateCheckoutAddress = async (
  userId,
  addressId
) => {
  if (!mongoose.isValidObjectId(addressId)) {
    throw new ApiError(400, "Invalid address ID");
  }

  const address = await Address.findOne({
    _id: addressId,
    userId,
  });

  if (!address) {
    throw new ApiError(404, "Address not found");
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
      throw new ApiError(404, `Product variant not found for variant ID: ${item.variantId}`);
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
  orderId,
  orderItems,
  session
) => {
  const reservations = [];

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
        returnDocument: "after",
        session,
      }
    );

    if (!inventory) {
      throw new ApiError(409, `Insufficient stock for variant ID: ${item.variantId}`);
    }

    const reservation = await Reservation.create(
      [
        {
          orderId,
          userId,
          variantId: item.variantId,
          quantity: item.quantity,
          status: "active",
          expiresAt: new Date(
            Date.now() + 15 * 60 * 1000
          ),
        },
      ],
      { session }
    );

    reservations.push(reservation[0]);
  }

  return reservations;
};

export const createPendingOrder = async (
  userId,
  orderItems,
  address,
  subtotal,
  session
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

  const order = await Order.create([
    {
      userId,
      items: orderItems,
      shippingAddress,
      subtotal,
      totalAmount: subtotal,
      status: "pending",
      paymentStatus: "pending",
    },
  ], { session });

  return order[0];
};

export const processCheckout = async (
  userId,
  addressId
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const cart = await validateCheckoutCart(userId);

    const address = await validateCheckoutAddress(
      userId,
      addressId
    );

    const { orderItems, subtotal } =
      await prepareOrderItems(cart);

    const order = await createPendingOrder(
      userId,
      orderItems,
      address,
      subtotal,
      session
    );

    const reservations =
      await reserveInventoryForCheckout(
        userId,
        order._id,
        orderItems,
        session
      );

    // Convert active reservations into actual stock deduction
    await convertOrderReservations(
      order._id,
      session
    );
    
    //Confirm Order and clear the cart after successful reservation and conversion
    await confirmOrder(
      order._id,
      session
    );

    await clearCart(
      userId,
      session
    );

    await session.commitTransaction();

    return {
      order,
      reservations,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const convertReservation = async (
  reservation,
  session
) => {
  const inventory = await Inventory.findOneAndUpdate(
    {
      variantId: reservation.variantId,
      reservedQuantity: {
        $gte: reservation.quantity,
      },
    },
    {
      $inc: {
        quantity: -reservation.quantity,
        reservedQuantity: -reservation.quantity,
      },
    },
    {
      returnDocument: "after",
      session,
    }
  );

  if (!inventory) {
    throw new ApiError(409, "Unable to convert reservation due to insufficient stock");
  }

  reservation.status = "converted";

  await reservation.save({ session });

  return {
    inventory,
    reservation,
  };
};

// Now one user have many product to reserve, so we need to convert all reservations for a user to inventory. This function will handle that by finding all active reservations for the user and converting them one by one.
export const convertOrderReservations = async (
  orderId,
  session
) => {
  const reservations = await Reservation.find({
    orderId,
    status: "active",
  }).session(session);

  if (reservations.length === 0) {
    throw new ApiError(400, "No active reservations found for order");
  }

  const convertedReservations = [];

  for (const reservation of reservations) {
    const result = await convertReservation(
      reservation,
      session
    );

    convertedReservations.push(result.reservation);
  }

  return convertedReservations;
};

//Conform order 
export const confirmOrder = async (orderId, session) => {
  const order = await Order.findOneAndUpdate(
    {
      _id: orderId,
      status: "pending",
    },
    {
      $set: {
        status: "confirmed",
      },
    },
    {
      new: true,
      session,
    }
  );

  if (!order) {
    throw new ApiError(400, "Unable to confirm order");
  }

  return order;
};

//Clearing the cart
export const clearCart = async (userId, session) => {
  const cart = await Cart.findOneAndUpdate(
    { userId },
    {
      $set: {
        items: [],
      },
    },
    {
      new: true,
      session,
    }
  );

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  return cart;
};

// restore inventory if order is canclled
export const restoreInventoryForOrder = async (
  order,
  session
) => {
  for (const item of order.items) {
    const inventory = await Inventory.findOneAndUpdate(
      {
        variantId: item.variantId,
      },
      {
        $inc: {
          quantity: item.quantity,
        },
      },
      {
        new: true,
        session,
      }
    );

    if (!inventory) {
      throw new ApiError(404, `Inventory not found for variant ${item.variantId}`);
    }
  }

  return true;
};

export const cancelOrder = async (
  userId,
  orderId
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const order = await Order.findOne({
      _id: orderId,
      userId,
    }).session(session);

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    if (order.status !== "confirmed") {
      throw new ApiError(400, "Only confirmed orders can be cancelled");
    }

    await restoreInventoryForOrder(
      order,
      session
    );

    order.status = "cancelled";

    await order.save({ session });

    await session.commitTransaction();

    return order;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const getUserOrders = async (userId) => {
  const orders = await Order.find({
    userId,
  }).sort({
    createdAt: -1,
  });

  return orders;
};

export const getOrderById = async (
  userId,
  orderId
) => {
  if (!mongoose.isValidObjectId(orderId)) {
    throw new ApiError(400, "Invalid order ID");
  }

  const order = await Order.findOne({
    _id: orderId,
    userId,
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return order;
};

// This is for admin only : ADMIN
export const getAllOrders = async () => {
  const orders = await Order.find()
    .sort({ createdAt: -1 });

  return orders;
};

export const getOrderByIdAdmin = async(
  orderId
) => {
  if(!mongoose.isValidObjectId(orderId)){
    throw new ApiError(400, "Invalid order ID");
  }

  const order = await Order.findById(orderId);

  if(!order){
    throw new ApiError(404, "Order not found");
  }
  return order;
}

export const updateOrderStatus = async (
  orderId,
  newStatus
) => {
  if (!mongoose.isValidObjectId(orderId)) {
    throw new ApiError(400, "Invalid order ID");
  }

  const allowedStatuses = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
  ];
  const allowedStatusTransitions = {
    pending: [],
    confirmed: ["shipped", "cancelled"],
    shipped: ["delivered"],
    delivered: [],
    cancelled: [],
  };

  if (!allowedStatuses.includes(newStatus)) {
    throw new ApiError(400, "Invalid order status");
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const allowedNextStatuses =
    allowedStatusTransitions[order.status];

  if (!allowedNextStatuses.includes(newStatus)) {
    throw new ApiError(400, `Cannot change order status from ${order.status} to ${newStatus}`);
  }

  order.status = newStatus;

  await order.save();

  return order;
};

export const adminCancelOrder = async (orderId) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const order = await Order.findOne({
      _id: orderId,
    }).session(session);

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    if (order.status !== "confirmed") {
      throw new ApiError(400, "Only confirmed orders can be cancelled");
    }

    await restoreInventoryForOrder(
      order,
      session
    );

    order.status = "cancelled";

    await order.save({ session });

    await session.commitTransaction();

    return order;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};