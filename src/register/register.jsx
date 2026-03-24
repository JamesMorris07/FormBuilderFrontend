import { useContext, useState } from 'react';
import { context, dispatchContext } from '../context.js';
import './register.css';

function RegisterForm({ setAuthView }) {

    const state = useContext(context);
    const dispatch = useContext(dispatchContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [organization, setOrganization] = useState('');
    const [error, setError] = useState('');
    

    async function handleRegister() {
    if (!email || !password || !organization) {
        setError("Please enter both email and password.");
        return;
    }

    try {
        const res = await fetch("http://127.0.0.1:5000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ email, password, organization }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "Registration failed");
            return;
        }

        console.log("User created:", data);
        setError("Account created! You can now log in.");

        // Optional: clear fields
        setEmail("");
        setPassword("");
        setOrganization("");

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

                <div>Organization</div>
                <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                />

                {/* eventually need to add another input box here, for company/organization */}
                {/* backend is not set up for it yet though, Mar 10th, 2026 */}

                <div>
                    <button
                        className="submit-button"
                        onClick={handleRegister}
                    >
                        Register
                    </button>
                </div>

                <div className="error-messages">
                    {error}
                </div>

                <div className="auth-switch">
                    Already have an account?{" "}
                    <span
                        className="auth-link"
                        onClick={() => setAuthView("login")}
                    >
                        Login here
                    </span>
                    .
                </div>

            </div>
        </div>
    );
}

export default RegisterForm;
