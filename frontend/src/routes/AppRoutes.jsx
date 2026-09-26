import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

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
            {/* this is the public URL Anyone can access it*/}
            <Route path="/" element={<Home />} />
            {/* this is the private URL Only authenticated users can access it*/}
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />
            {/* this is the catch all URL If no match is found, it will redirect to the home page*/}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
