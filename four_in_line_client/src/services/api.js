// src/services/api.js
const BASE_URL = 'http://localhost:5173'; // Target backend server 

export const loginCall = (credentials) => {
    return fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    }); // POST /api/auth/login [cite: 29]
};

export const logoutCall = () => {
    return fetch(`${BASE_URL}/api/auth/logout`, { method: 'POST' }); // POST /api/auth/logout [cite: 34]
};

export const fetchCurrentUser = () => {
    return fetch(`${BASE_URL}/api/users/me`, { 
        method: 'GET',
        headers: { 'x-user-id': localStorage.getItem('userId') || '-1' }, // Pass user ID for authentication,
        params: { id: localStorage.getItem('userId') || '-1' } // Pass user ID for
    }); // GET /api/users/me [cite: 34]
};

export const fetchMatches = (userId) => {
    return fetch(`${BASE_URL}/api/matches`, { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
            'x-user-id': userId || 'user'
         }

        }); // GET /matches [cite: 47]
};

export const fetchSettings = () => {
    return fetch(`${BASE_URL}/api/settings`); // GET /api/settings [cite: 43]
};

export const updateSettings = (data) => {
    return fetch(`${BASE_URL}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }); // PUT /api/settings [cite: 43]
};