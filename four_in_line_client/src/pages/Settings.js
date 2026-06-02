// src/pages/Settings.js
import React, { useState, useEffect } from 'react';
import { fetchSettings, updateSettings } from '../services/api';

const Settings = () => {
    // At least 3 editable settings [cite: 42]
    const [settings, setSettings] = useState({ username: '', email: '', theme: 'light' });
    const [status, setStatus] = useState({ loading: true, saving: false, error: null, success: null });

    useEffect(() => {
        const getSettings = async () => {
            try {
                const res = await fetchSettings();
                if (res.ok) {
                    const data = await res.json();
                    setSettings(data);
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
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ ...status, saving: true, error: null, success: null });
        
        try {
            const res = await updateSettings(settings);
            if (res.ok) {
                setStatus({ ...status, saving: false, success: 'Settings updated successfully!' });
            } else {
                throw new Error('Update failed');
            }
        } catch (err) {
            setStatus({ ...status, saving: false, error: 'Failed to save settings.' });
        }
    };

    if (status.loading) return <p>Loading settings...</p>; // Loading state [cite: 44]

    return (
        <div>
            <h2>User Settings</h2>
            {status.success && <p style={{ color: 'green' }}>{status.success}</p>}
            {status.error && <p style={{ color: 'red' }}>{status.error}</p>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', gap: '10px' }}>
                <label>
                    Username:
                    <input type="text" name="username" value={settings.username} onChange={handleChange} required />
                </label>
                <label>
                    Email:
                    <input type="email" name="email" value={settings.email} onChange={handleChange} required />
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