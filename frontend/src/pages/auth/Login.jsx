import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (!formData.email || !formData.password) {
            setError("Email and password are required.");
            return;
        }

        try {
            setIsSubmitting(true);

            await login(formData);

            navigate("/", { replace: true });
        } catch (error) {
            console.error(
                "Login failed:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Login failed. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "40px auto", padding: "20px", fontFamily: "sans-serif" }}>
            <h1>Login to Stockmint</h1>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="email" style={{ display: "block", marginBottom: "5px" }}>
                        Email
                    </label>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="password" style={{ display: "block", marginBottom: "5px" }}>
                        Password
                    </label>

                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                    />
                </div>

                {error && (
                    <p style={{ color: "#e53e3e", marginBottom: "15px" }}>
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                        width: "100%",
                        padding: "10px",
                        backgroundColor: "#3182ce",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}
                >
                    {isSubmitting ? "Logging in..." : "Login"}
                </button>
            </form>

            <p style={{ marginTop: "20px", textAlign: "center" }}>
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
};

export default Login;