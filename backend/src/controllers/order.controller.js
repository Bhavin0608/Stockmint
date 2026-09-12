//import { validateCheckoutCart, validateCheckoutAddress, prepareOrderItems, reserveInventoryForCheckout, createPendingOrder } from "../services/order.service.js";
import { processCheckout, cancelOrder, getUserOrders, getOrderById, getAllOrders, getOrderByIdAdmin, updateOrderStatus, adminCancelOrder } from "../services/order.service.js";

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

export const cancel = async (req, res, next) => {
  try {
    const order = await cancelOrder(
      req.user._id,
      req.params.orderId
    );

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (
  req,
  res,
  next
) => {
  try {
    const orders = await getUserOrders(
      req.user._id
    );

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderByIdController = async (
  req,
  res,
  next
) => {
  try {
    const order = await getOrderById(
      req.user._id,
      req.params.orderId
    );

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN

export const getAllOrdersAdmin = async (
  req,
  res,
  next
) => {
  try {
    const orders = await getAllOrders();

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderAdminById = async(req, res, next) => {
  try{
    const orders = await getOrderByIdAdmin(req.params.orderId);
    res.status(200).json({
      success: true,
      data: orders
    });
  }
  catch(error){
    next(error);
  }
};

export const updateStatus = async (
  req,
  res,
  next
) => {
  try {
    const order = await updateOrderStatus(
      req.params.orderId,
      req.body.status
    );

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const adminCancelOrderController = async (
  req,
  res,
  next
) => {
  try {
    const order = await adminCancelOrder(
      req.params.orderId
    );

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};