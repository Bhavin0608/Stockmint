import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
    const { user, isAuthenticated, logout } = useContext(AuthContext);

    return (
        <div style={{ maxWidth: "700px", margin: "40px auto", padding: "0 24px", width: "100%" }}>
            <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}>Stockmint Storefront</h1>
            <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>
                Browse products, add items to cart, and manage your orders.
            </p>

            {isAuthenticated && user ? (
                <div
                    style={{
                        backgroundColor: "var(--card-bg)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        padding: "24px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                    }}
                >
                    <h2 style={{ fontSize: "20px", marginBottom: "16px" }}>Account Overview</h2>
                    <div style={{ backgroundColor: "var(--bg-secondary)", padding: "16px", borderRadius: "6px", marginBottom: "20px" }}>
                        <p style={{ marginBottom: "8px" }}><strong>Name:</strong> {user.name}</p>
                        <p style={{ marginBottom: "8px" }}><strong>Email:</strong> {user.email}</p>
                        <p style={{ marginBottom: "8px" }}><strong>Role:</strong> <span style={{ textTransform: "uppercase", fontSize: "12px", fontWeight: "700", padding: "2px 8px", backgroundColor: "var(--primary)", color: "#fff", borderRadius: "4px" }}>{user.role}</span></p>
                        <p><strong>Status:</strong> {user.status}</p>
                    </div>
                    <button
                        onClick={logout}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "var(--danger)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "600"
                        }}
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <div
                    style={{
                        backgroundColor: "var(--card-bg)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        padding: "24px",
                        textAlign: "center"
                    }}
                >
                    <p style={{ fontSize: "16px", marginBottom: "16px" }}>
                        Welcome to Stockmint! Please sign in or create an account to start shopping.
                    </p>
                    <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                        <Link
                            to="/login"
                            style={{
                                padding: "8px 18px",
                                backgroundColor: "var(--primary)",
                                color: "#fff",
                                textDecoration: "none",
                                borderRadius: "6px",
                                fontSize: "14px",
                                fontWeight: "500"
                            }}
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            style={{
                                padding: "8px 18px",
                                backgroundColor: "var(--bg-secondary)",
                                color: "var(--text)",
                                border: "1px solid var(--border)",
                                textDecoration: "none",
                                borderRadius: "6px",
                                fontSize: "14px",
                                fontWeight: "500"
                            }}
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
