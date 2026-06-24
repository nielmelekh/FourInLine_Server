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
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        navigate('/login');
        window.location.reload(); // Handle logout correctly
    };

    return (
    <nav className="navbar">
        <div className="logo">Four In Line</div>

        <div className="nav-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/settings">Settings</Link>
            <Link to="/friends">Friends</Link>
        </div>

        <div className="nav-user">
            <span>Hello, {user?.username}</span>
            <button onClick={handleLogout}>Logout</button>
        </div>
    </nav>
    );
};

export default Navbar;