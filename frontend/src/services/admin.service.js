import api from "./api";

// Category Management
export const createCategory = async (categoryData) => {
    const response = await api.post("/categories", categoryData);
    return response.data;
};

export const updateCategory = async (id, updates) => {
    const response = await api.put(`/categories/${id}`, updates);
    return response.data;
};

export const deleteCategory = async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
};

// Product Management
export const createProduct = async (productData) => {
    const response = await api.post("/products", productData);
    return response.data;
};

export const updateProduct = async (id, updates) => {
    const response = await api.put(`/products/${id}`, updates);
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
};

// Product Variants & Inventory
export const getProductVariants = async (productId) => {
    const response = await api.get(`/products/${productId}/variants`);
    return response.data;
};

export const createProductVariant = async (productId, variantData) => {
    const response = await api.post(`/products/${productId}/variants`, variantData);
    return response.data;
};

export const updateProductVariant = async (productId, variantId, updates) => {
    const response = await api.patch(`/products/${productId}/variants/${variantId}`, updates);
    return response.data;
};

export const deleteProductVariant = async (productId, variantId) => {
    const response = await api.delete(`/products/${productId}/variants/${variantId}`);
    return response.data;
};

export const updateVariantInventory = async (variantId, quantity) => {
    const response = await api.patch(`/inventory/${variantId}`, { quantity: Number(quantity) });
    return response.data;
};

// Admin Orders
export const getAllOrdersAdmin = async () => {
    const response = await api.get("/admin/orders");
    return response.data;
};

export const getOrderAdminById = async (orderId) => {
    const response = await api.get(`/admin/orders/${orderId}`);
    return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
    const response = await api.patch(`/admin/orders/${orderId}/status`, { status });
    return response.data;
};

export const adminCancelOrder = async (orderId) => {
    const response = await api.patch(`/admin/orders/${orderId}/cancel`);
    return response.data;
};
