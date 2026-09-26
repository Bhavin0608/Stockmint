import { createContext, useState, useEffect, useRef } from "react";
import { loginUser, logoutUser, refreshAccessToken } from "../services/auth.service";
import { getProfile } from "../services/user.service";
import { setAccessToken as saveAccesstoken, clearAccessToken as removeAccessToken } from "../utils/tokenManager";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const hasInitialized  = useRef(false);

    const isAuthenticated = !!user && !!accessToken;

    // Function to handle user login
    const login = async (credentials) => {
        const response = await loginUser(credentials);

        setAccessToken(response.data.accessToken);
        saveAccesstoken(response.data.accessToken);

        setUser(response.data.user);

        return response;
    };

    // Function to handle user logout
    const logout = async () => {
        try {
            await logoutUser();
        } finally {
            setUser(null);
            setAccessToken(null);
            removeAccessToken();
        }
    };

    // Function to refresh the access token and update user state
    const refreshSession = async () => {
        try {
            const response = await refreshAccessToken();
            const newAccessToken = response.data.accessToken;

            setAccessToken(newAccessToken);
            saveAccesstoken(newAccessToken);

            const profileResponse = await getProfile();

            setUser(profileResponse.data);
        } catch {
            setUser(null);
            setAccessToken(null);
            removeAccessToken();
        } finally {
            setLoading(false);
        }
    };

    // Refresh the session on component mount. Once it is done, set loading to false. This will ensure that the app knows whether the user is authenticated or not when it first loads.
    useEffect(() => {
        if(!hasInitialized.current){
            refreshSession();
            hasInitialized.current = true;
        }
        return;
    }, []);

    return (
        <AuthContext.Provider
            value={{user, accessToken, isAuthenticated, loading, setUser, setAccessToken, setLoading, login, logout, refreshSession}}>
            {children}
        </AuthContext.Provider>
    );
};