// src/components/Navbar.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCurrentUser, logoutCall } from '../services/api';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await fetchCurrentUser();
                if (response.ok) {
                    const responseJson = await response.json();
                    setUser(responseJson.data); // Set user data from API response [cite: 34]
                } else {
                    setUser({ name: 'Guest User' }); // Fallback
                }
            } catch (err) {
                setUser({ name: 'Guest User' });
            }
        };
        getUser();
    }, []);

    const handleLogout = async () => {
        await logoutCall();
        localStorage.removeItem('token');
        navigate('/login');
        window.location.reload(); // Handle logout correctly [cite: 35]
    };

    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', background: '#eee' }}>
            <div><strong>Four In Line API</strong></div> {/* Project name/logo [cite: 33] */}
            <div style={{ display: 'flex', gap: '15px' }}>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/settings">Settings</Link>
            </div>
            <div>
                <span style={{ marginRight: '15px' }}>Hello, {user?.username}</span> {/* Display user information [cite: 35] */}
                <button onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;