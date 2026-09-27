import api from "./api";

export const createOrderCheckout = async ({ addressId }) => {
    const response = await api.post("/orders/checkout", { addressId });
    return response.data;
};

export const getUserOrders = async () => {
    const response = await api.get("/orders");
    return response.data;
};

export const getOrderById = async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
};

export const cancelOrder = async (orderId) => {
    const response = await api.patch(`/orders/cancel/${orderId}`);
    return response.data;
};
