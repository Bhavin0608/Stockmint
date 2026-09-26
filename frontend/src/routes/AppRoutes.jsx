import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import MainLayout from "../layouts/MainLayout";

const AppRoutes = () => {
    const { isAuthenticated, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div style={{ padding: "40px", textAlign: "center", fontFamily: "sans-serif" }}>
                <p>Loading session...</p>
            </div>
        );
    }

    return (
        <Routes>
            {/* Here in main page having nav bar and footer and in between specific content displayed according to the route */}
            <Route element={<MainLayout />}>
                {/* this is the public URL Anyone can access it*/}
                <Route path="/" element={<Home />} />
                {/* these are guest URLs Only non-authenticated users should access them*/}
                <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
                <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />
                {/* this is the catch all URL If no match is found, it will redirect to the home page*/}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
