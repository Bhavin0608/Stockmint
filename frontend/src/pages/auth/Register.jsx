import { useState } from "react";
import { registerUser } from "../../services/auth.service";

const Register = () => {
    const [formData, setFormData] = useState({name: "", email: "", password: "",});
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({...previous, [name]: value,}));
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
            setSuccess("Registration successful. You can now login.");
            setFormData({name: "", email: "", password: "",});
        } 
        catch (error) {
            console.error("Registration failed:", error.response?.data || error.message);
            setError(error.response?.data?.message || "Registration failed. Please try again.");
        } 
        finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h1>Create your Stockmint account</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name"> Name </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"/>
                </div>
                <div>
                    <label htmlFor="email"> Email </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"/>
                </div>
                <div>
                    <label htmlFor="password"> Password </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"/>
                </div>
                {error && ( <p>{error}</p> )}
                {success && ( <p>{success}</p> )}
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating account..." : "Register"}
                </button>
            </form>
        </div>
    );
};

export default Register;