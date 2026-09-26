import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../../services/auth.service";

const Register = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
            setError("All fields are required.");
            return;
        }

        try {
            setIsSubmitting(true);
            await registerUser(formData);
            setSuccess("Registration successful! You can now log in.");
            setFormData({ name: "", email: "", password: "" });
        } catch (error) {
            console.error("Registration failed:", error.response?.data || error.message);
            setError(error.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "40px auto", padding: "20px", fontFamily: "sans-serif" }}>
            <h1>Create your Stockmint account</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="name" style={{ display: "block", marginBottom: "5px" }}>
                        Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                    />
                </div>
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
                {error && <p style={{ color: "#e53e3e", marginBottom: "15px" }}>{error}</p>}
                {success && (
                    <div style={{ color: "#38a169", marginBottom: "15px" }}>
                        <p>{success}</p>
                        <p style={{ marginTop: "5px" }}>
                            <Link to="/login" style={{ fontWeight: "bold", color: "#3182ce" }}>Click here to Log in</Link>
                        </p>
                    </div>
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
                    {isSubmitting ? "Creating account..." : "Register"}
                </button>
            </form>

            <p style={{ marginTop: "20px", textAlign: "center" }}>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
};

export default Register;