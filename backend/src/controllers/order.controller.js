//import { validateCheckoutCart, validateCheckoutAddress, prepareOrderItems, reserveInventoryForCheckout, createPendingOrder } from "../services/order.service.js";
import { processCheckout, cancelOrder, getUserOrders, getOrderById, getAllOrders, getOrderByIdAdmin, updateOrderStatus, adminCancelOrder } from "../services/order.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const checkout = async (req, res, next) => {
  try {
    const result = await processCheckout(req.user._id, req.body.addressId);
    return new ApiResponse(201, result, "Order created successfully").send(res);
  } 
  catch (error) {
    next(error);
  }
};

export const cancel = async (req, res, next) => {
  try {
    const order = await cancelOrder(req.user._id, req.params.orderId);
    return new ApiResponse(200, order, "Order cancelled successfully").send(res);
  } 
  catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await getUserOrders(req.user._id);
    return new ApiResponse(200, orders, "Orders retrieved successfully").send(res);
  } 
  catch (error) {
    next(error);
  }
};

export const getOrderByIdController = async (req, res, next) => {
  try {
    const order = await getOrderById(req.user._id, req.params.orderId);
    return new ApiResponse(200, order, "Order retrieved successfully").send(res);
  } 
  catch (error) {
    next(error);
  }
};

// ADMIN

export const getAllOrdersAdmin = async (req, res, next) => {
  try {
    const orders = await getAllOrders();
    return new ApiResponse(200, orders, "Orders retrieved successfully").send(res);
  } 
  catch (error) {
    next(error);
  }
};

export const getOrderAdminById = async(req, res, next) => {
  try{
    const orders = await getOrderByIdAdmin(req.params.orderId);
    return new ApiResponse(200, orders, "Order retrieved successfully").send(res);
  }
  catch(error){
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const order = await updateOrderStatus(req.params.orderId, req.body.status);
    return new ApiResponse(200, order, "Order status updated successfully").send(res);
  } 
  catch (error) {
    next(error);
  }
};

export const adminCancelOrderController = async (req, res, next) => {
  try {
    const order = await adminCancelOrder(req.params.orderId);
    return new ApiResponse(200, order, "Order cancelled successfully").send(res);
  } 
  catch (error) {
    next(error);
  }
};