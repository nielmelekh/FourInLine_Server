// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';

function App() {
    // Basic auth state simulation for routing protection
    const isAuthenticated = !!localStorage.getItem('token'); 

    return (
        <Router>
            {isAuthenticated && <Navbar />}
            <div className="main-content" style={{ minHeight: '80vh', padding: '20px' }}>
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