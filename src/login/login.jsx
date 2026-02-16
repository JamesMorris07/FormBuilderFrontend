import { useContext, useState } from 'react';
import { context, dispatchContext } from '../context.js';
import './login.css';

function LoginForm() {

    const state = useContext(context);
    const dispatch = useContext(dispatchContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    function handleLogin() {
        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }

        console.log("Email:", email);
        console.log("Password:", password);

        // Later this is where we'll call our Flask API

        setError('');
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

            </div>
        </div>
    );
}

export default LoginForm;
