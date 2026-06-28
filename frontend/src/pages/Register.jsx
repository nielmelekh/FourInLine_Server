import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerCall } from "../services/api";

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(""); // Only track general/API errors in state
    const navigate = useNavigate();

    // Derive errors dynamically on every render
    // These will always be perfectly in sync with the latest formData
    const errors = {};
    const nameRegex = /^[A-Za-z]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formData.firstName) {
        if (formData.firstName.length > 16) errors.firstName = "At most 16 characters.";
        else if (!nameRegex.test(formData.firstName)) errors.firstName = "Only letters and no spaces.";
    }
    
    if (formData.lastName) {
        if (formData.lastName.length > 16) errors.lastName = "At most 16 characters.";
        else if (!nameRegex.test(formData.lastName)) errors.lastName = "Only letters and no spaces.";
    }

    if (formData.username) {
        if (formData.username.length > 16) errors.username = "At most 16 characters.";
        else if (formData.username.includes(' ')) errors.username = "No spaces allowed.";
    }

    if (formData.email && !emailRegex.test(formData.email)) {
        errors.email = "Please enter a valid email address.";
    }

    if (formData.password && formData.password.length < 6) {
        errors.password = "Must be at least 6 characters.";
    }

    // Direct string comparison, no state sync issues!
    if (formData.confirmPassword && formData.confirmPassword !== formData.password) {
        errors.confirmPassword = "Confirmation does not match password.";
    }

    // handleChange becomes incredibly simple
    const handleChange = (e) => {
        setApiError(""); // Clear API errors on typing
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Check if our dynamically generated errors object has any keys
        if (Object.keys(errors).length > 0) {
            setApiError("Please fix the errors above before submitting.");
            return;
        }

        setLoading(true);

        try {
            const response = await registerCall(formData);

            if (response.ok) {
                navigate("/login");
            } else {
                const responseJson = await response.json();
                setApiError(responseJson.error || "Registration failed.");
            }
        } catch (err) {
            setApiError("Network error. Backend might be unreachable.");
        } finally {
            setLoading(false);
        }
    };

    const errorStyle = { color: "red", fontSize: "0.85em", margin: "5px 0 0 0", display: "block" };

    return (
        <div className="login-container">
            <h2>Create Account</h2>

            {apiError && <p style={{ color: "red", fontWeight: "bold" }}>{apiError}</p>}

            <form onSubmit={handleSubmit} autoComplete="off">
                {/* Inputs remain exactly the same */}
                <div style={{ marginBottom: "15px" }}>
                    <label>First Name:</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} autoComplete="off" required />
                    {errors.firstName && <span style={errorStyle}>{errors.firstName}</span>}
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Last Name:</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} autoComplete="off" required />
                    {errors.lastName && <span style={errorStyle}>{errors.lastName}</span>}
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Username:</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} autoComplete="off" required />
                    {errors.username && <span style={errorStyle}>{errors.username}</span>}
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} autoComplete="off" required />
                    {errors.email && <span style={errorStyle}>{errors.email}</span>}
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} autoComplete="new-password" required />
                    {errors.password && <span style={errorStyle}>{errors.password}</span>}
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Confirm Password:</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} autoComplete="off" required />
                    {errors.confirmPassword && <span style={errorStyle}>{errors.confirmPassword}</span>}
                </div>

                <button type="submit" disabled={loading || Object.keys(errors).length > 0}>
                    {loading ? "Creating account..." : "Create Account"}
                </button>

                <button type="button" onClick={() => navigate("/login")} style={{ marginLeft: "10px" }}>
                    Back to Login
                </button>
            </form>
        </div>
    );
};

export default Register;