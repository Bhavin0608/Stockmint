import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
    const { user, isAuthenticated, logout } = useContext(AuthContext);

    return (
        <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px", fontFamily: "sans-serif" }}>
            <h1>Stockmint</h1>
            <p>E-commerce Web Application</p>

            {/* Here we display the user information if we are authenticated else we display a not login message. */}
            {isAuthenticated && user ? (
                <div>
                    <h2>Welcome, {user.name}!</h2>
                    <div style={{ background: "#f4f4f4", padding: "15px", borderRadius: "6px", margin: "15px 0" }}>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Role:</strong> {user.role}</p>
                        <p><strong>Status:</strong> {user.status}</p>
                    </div>
                    <button
                        onClick={logout}
                        style={{
                            padding: "10px 18px",
                            backgroundColor: "#e53e3e",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "bold"
                        }}
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <div>
                    <p>You are not logged in.</p>
                    <div style={{ display: "flex", gap: "12px", marginTop: "15px" }}>
                        <Link
                            to="/login"
                            style={{
                                padding: "8px 16px",
                                backgroundColor: "#3182ce",
                                color: "#fff",
                                textDecoration: "none",
                                borderRadius: "4px",
                                fontSize: "14px"
                            }}
                        >
                            Go to Login
                        </Link>
                        <Link
                            to="/register"
                            style={{
                                padding: "8px 16px",
                                backgroundColor: "#4a5568",
                                color: "#fff",
                                textDecoration: "none",
                                borderRadius: "4px",
                                fontSize: "14px"
                            }}
                        >
                            Go to Register
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
