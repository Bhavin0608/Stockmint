import api from "./api";

export const getProfile = async () => {
    const response = await api.get("/user/profile");
    return response.data;
};

export const updateProfile = async (updates) => {
    const response = await api.put("/user/profile", updates);
    return response.data;
};