import { useContext, useState } from 'react';
import { context, dispatchContext } from '../context.js';
import './login.css';
import { useNavigate } from "react-router-dom";

function LoginForm({ setAuthView, setLoggedIn }) {

    const state = useContext(context);
    const dispatch = useContext(dispatchContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function handleLogin() {
    if (!email || !password) {
        setError("Please enter both email and password.");
        return;
    }

    try {
        const res = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // IMPORTANT for cookies
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.msg || data.error || "Login failed");
            return;
        }

        console.log("Login success:", data);
        setLoggedIn(true);
        navigate("/data");

        // Optional: redirect later
        // window.location.href = "/dashboard";

    } catch (err) {
        setError("Network error: " + err.message);
    }
}

    return (
        <div className="login-container">
            <div className="loginbox">

                <div>Email</div>
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <div>Password</div>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div>
                    <button
                    className="submit-button"
                    onClick={handleLogin}
                    >
                    Login
                    </button>
                </div>

                <div className="error-messages">
                    {error}
                </div>

                <div className="auth-switch">
                    Don't have an account?{" "}
                    <span
                        className="auth-link"
                        onClick={() => setAuthView("register")}
                    >
                        Register here
                    </span>
                    .
                </div>

            </div>
        </div>
        );
}

export default LoginForm;
