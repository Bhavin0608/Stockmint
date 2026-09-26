import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
    const { user, isAuthenticated, logout } = useContext(AuthContext);

    const navLinkStyle = ({ isActive }) => ({
        padding: "8px 12px",
        borderRadius: "6px",
        fontWeight: "500",
        fontSize: "14px",
        textDecoration: "none",
        color: isActive ? "var(--primary)" : "var(--text)",
        backgroundColor: isActive ? "var(--bg-secondary)" : "transparent",
        transition: "all 0.2s ease"
    });

    return (
        <header
            style={{
                backgroundColor: "var(--bg)",
                borderBottom: "1px solid var(--border)",
                position: "sticky",
                top: 0,
                zIndex: 100,
                width: "100%"
            }}
        >
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "12px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px"
                }}
            >
                {/* Brand Logo */}
                <Link
                    to="/"
                    style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "var(--primary)",
                        textDecoration: "none",
                        letterSpacing: "-0.5px"
                    }}
                >
                    Stockmint
                </Link>

                {/* Navigation Links */}
                <nav
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px"
                    }}
                >

                    {isAuthenticated && user ? (
                        <>
                            {user.role === "admin" && (
                                <NavLink to="/admin" style={navLinkStyle}>
                                    Admin
                                </NavLink>
                            )}

                            <span
                                style={{
                                    fontSize: "14px",
                                    color: "var(--text-muted)",
                                    marginLeft: "8px"
                                }}
                            >
                                Hi, <strong>{user.name}</strong>
                            </span>

                            <button
                                onClick={logout}
                                style={{
                                    padding: "6px 14px",
                                    backgroundColor: "var(--danger)",
                                    color: "#ffffff",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    marginLeft: "8px",
                                    transition: "background-color 0.2s ease"
                                }}
                                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "var(--danger-hover)")}
                                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "var(--danger)")}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" style={navLinkStyle}>
                                Login
                            </NavLink>
                            <NavLink
                                to="/register"
                                style={({ isActive }) => ({
                                    padding: "8px 14px",
                                    backgroundColor: "var(--primary)",
                                    color: "#ffffff",
                                    borderRadius: "6px",
                                    fontWeight: "500",
                                    fontSize: "14px",
                                    textDecoration: "none",
                                    opacity: isActive ? 0.9 : 1,
                                    transition: "background-color 0.2s ease"
                                })}
                            >
                                Register
                            </NavLink>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
