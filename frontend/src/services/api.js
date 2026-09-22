import axios from 'axios';
import { getAccessToken } from '../utils/tokenManager';

// What is axios? => It tansfer data between client to server.
// It send the http request to the server and get the response from the server. 
// It is a promise based library. It is used to make HTTP requests from the browser. 
// It is used to make API calls. It is used to make GET, POST, PUT, DELETE requests. It is used to make requests to the server. It is used to make requests to the backend. It is used to make requests to the database. It is used to make requests to the API. It is used to make requests to the server and get the response from the server.
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, 
    withCredentials: true, // This allows the browser to send credentials (cookies, authorization headers, etc.) with the request.
});

api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;