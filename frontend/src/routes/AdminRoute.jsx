import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminRoute = () => {
    const { user, isAuthenticated, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                <p>Checking admin authorization...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
