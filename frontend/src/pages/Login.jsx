// src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginCall } from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validation: Email required, Password >= 6 chars [cite: 28]
        if (!email.includes('@')) {
            setError('Please enter a valid email.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true); // Show loading state [cite: 30]
        try {
            const response = await loginCall({ email, password });
            if (response.ok) {
                const responseJson = await response.json();
                localStorage.setItem('token', responseJson.data.token); // Store mock token
                localStorage.setItem('userRole', responseJson.data.user.userRole); // Store user role
                localStorage.setItem('userId', responseJson.data.user.userId); // Store user ID
                localStorage.setItem('username', responseJson.data.user.username); // Store username
                document.documentElement.setAttribute('data-theme', responseJson.data.user.theme);
                localStorage.setItem('theme', responseJson.data.user.theme); // Store theme preference
                localStorage.setItem('dashboardShowCards', responseJson.data.user.dashboardShowCards); // Store dashboard preference
                navigate('/dashboard'); // Redirect after successful login [cite: 30]
                window.location.reload(); // Force navbar render
            } else {
                setError('Login failed. Please check your credentials.'); // Show error message [cite: 30]
            }
        } catch (err) {
            setError('Network error. Backend might be unreachable.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default Login;