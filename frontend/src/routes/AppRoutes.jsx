import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProductDetails from "../pages/ProductDetails";
import AddressList from "../pages/addresses/AddressList";
import Cart from "../pages/cart/Cart";
import Checkout from "../pages/checkout/Checkout";
import OrderSuccess from "../pages/checkout/OrderSuccess";
import OrderList from "../pages/orders/OrderList";
import OrderDetail from "../pages/orders/OrderDetail";
import Profile from "../pages/profile/Profile";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

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
                <Route path="/products/:id" element={<ProductDetails />} />

                {/* Authenticated Customer Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/addresses" element={<AddressList />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/checkout/success" element={<OrderSuccess />} />
                    <Route path="/orders" element={<OrderList />} />
                    <Route path="/orders/:id" element={<OrderDetail />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>

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
