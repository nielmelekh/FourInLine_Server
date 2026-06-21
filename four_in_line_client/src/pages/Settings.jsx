// src/pages/Settings.js
import React, { useState, useEffect } from 'react';
import { fetchSettings, updateSettings } from '../services/api';

const Settings = () => {
    // At least 3 editable settings [cite: 42]
    const [settings, setSettings] = useState({ username: '', dashboardShowCards: 'latest', theme: 'light' });
    const [status, setStatus] = useState({ loading: true, saving: false, error: null, success: null });

    useEffect(() => {
        const getSettings = async () => {
            try {
                const res = await fetchSettings();
                if (res.ok) {
                    const responseJson = await res.json();
                    setSettings(responseJson.data);
                    if (responseJson.data.theme) {
                        document.documentElement.setAttribute('data-theme', responseJson.data.theme);
                        localStorage.setItem('theme', responseJson.data.theme);
                    }
                }
            } catch (err) {
                setStatus(prev => ({ ...prev, error: 'Failed to load settings.' }));
            } finally {
                setStatus(prev => ({ ...prev, loading: false }));
            }
        };
        getSettings();
    }, []);

    const handleChange = (e) => {
    const updatedSettings = { ...settings, [e.target.name]: e.target.value };
    setSettings(updatedSettings);

    // Update the visual theme immediately without changing the server flow.
    /*
    if (e.target.name === 'theme') {
        document.documentElement.setAttribute('data-theme', e.target.value);
        localStorage.setItem('theme', e.target.value);
    }

    if (e.target.name === 'dashboardShowCards') {
        alert(`Dashboard preference changed to: ${e.target.value}`); // Inform users about their dashboard preference change [cite: 43]
        localStorage.setItem('dashboardShowCards', e.target.value);
    }
        */
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ ...status, saving: true, error: null, success: null });
        
        try {
            const res = await updateSettings(settings);
            if (res.ok) {
                setStatus({ ...status, saving: false, success: 'Settings updated successfully!' });
                
                document.documentElement.setAttribute('data-theme', settings.theme);
                localStorage.setItem('theme', settings.theme);

                localStorage.setItem('dashboardShowCards', settings.dashboardShowCards);
                localStorage.setItem('username', settings.username); // Store username

            } else {
                throw new Error('Update failed');
            }
        } catch (err) {
            setStatus({ ...status, saving: false, error: 'Failed to save settings.' });
        }
    };

    if (status.loading) return <p>Loading settings...</p>; // Loading state [cite: 44]

    return (
        <div className="settings-container">
            <h2>User Settings</h2>
            {status.success && <p style={{ color: 'green' }}>{status.success}</p>}
            {status.error && <p style={{ color: 'red' }}>{status.error}</p>}
            
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input type="text" name="username" value={settings.username} onChange={handleChange} />
                </label>
                <label>
                    Dashboard Show Cards Preference:
                    <select name="dashboardShowCards" value={settings.dashboardShowCards} onChange={handleChange}>
                        <option value="latest">Latest</option>
                        <option value="best">Best</option>
                    </select>
                </label>
                <label>
                    Theme Preference:
                    <select name="theme" value={settings.theme} onChange={handleChange}>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                    </select>
                </label>
                <button type="submit" disabled={status.saving}>
                    {status.saving ? 'Saving...' : 'Save Settings'}
                </button>
            </form>
        </div>
    );
};

export default Settings;