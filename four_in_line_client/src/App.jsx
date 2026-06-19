// src/App.js
import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';

function App() {
    // Basic auth state simulation for routing protection
    const isAuthenticated = !!localStorage.getItem('token'); 

    useEffect(() => {
        // Apply the saved visual theme when the application loads.
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    return (
        <Router>
            {isAuthenticated && <Navbar />}
            <div className="main-content">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
                    <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
                    <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
                </Routes>
            </div>
            <Footer />
        </Router>
    );
}

export default App;