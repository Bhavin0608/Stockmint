import api from "./api";

export const getProducts = async ({ page = 1, limit = 12, categoryId } = {}) => {
    const params = { page, limit };
    if (categoryId) {
        params.categoryId = categoryId;
    }

    const response = await api.get("/products", { params });
    return response.data;
};

export const getProductById = async (productId) => {
    const response = await api.get(`/products/${productId}`);
    return response.data;
};

export const getProductVariants = async (productId) => {
    const response = await api.get(`/products/${productId}/variants`);
    return response.data;
};
