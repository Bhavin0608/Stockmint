import api from "./api";

export const getCart = async () => {
    const response = await api.get("/cart");
    return response.data;
};

export const addItemToCart = async (variantId, quantity) => {
    const response = await api.post("/cart/items", { variantId, quantity });
    return response.data;
};

export const updateCartItemQuantity = async (variantId, quantity) => {
    const response = await api.patch(`/cart/items/${variantId}`, { quantity });
    return response.data;
};

export const removeCartItem = async (variantId) => {
    const response = await api.delete(`/cart/items/${variantId}`);
    return response.data;
};
