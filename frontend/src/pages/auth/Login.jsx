import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
    const { login, user, isAuthenticated } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        try {
            await login({
                email,
                password,
            });

            console.log("Login successful");
        } catch (error) {
            console.error(
                "Login failed:",
                error.response?.data || error.message
            );

            setError(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    };

    return (
        <div>
            <h1>Stockmint Login</h1>

            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)}/><br/>
                <input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)}/><br/>

                <button type="submit">
                    Login
                </button>
            </form>

            {error && <p>{error}</p>}

            {isAuthenticated && (
                <div>
                    <h2>Authenticated</h2>
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                    <p>Role: {user.role}</p>
                </div>
            )}
        </div>
    );
};

export default Login;