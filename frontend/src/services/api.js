// src/services/api.js
const BASE_URL = 'http://localhost:3000'; // Target backend server 

export const loginCall = (credentials) => {
    return fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    }); // POST /api/auth/login [cite: 29]
};

export const logoutCall = () => {
    return fetch(`${BASE_URL}/api/auth/logout`, { method: 'POST' }); // POST /api/auth/logout
};

export const fetchCurrentUser = () => {
    return fetch(`${BASE_URL}/api/users/me`, { 
        method: 'GET',
        headers: { 'x-user-id': localStorage.getItem('userId') || '-1' }, // Pass user ID for authentication,
        params: { id: localStorage.getItem('userId') || '-1' } // Pass user ID for
    }); // GET /api/users/me
};

export const fetchMatches = (userId) => {
    return fetch(`${BASE_URL}/api/matches`, { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
            'x-user-id': userId || 'user'
         }

        }); // GET /matches
};

export const fetchSettings = () => {
    return fetch(`${BASE_URL}/api/settings`, { // GET /api/settings
        method: 'GET',
        headers: { 'x-user-id': localStorage.getItem('userId') || '-1' }
    });
};

export const updateSettings = (data) => {
    return fetch(`${BASE_URL}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-user-id': localStorage.getItem('userId') || '-1' },
        body: JSON.stringify(data)
    }); // PUT /api/settings
};

export const fetchFriendsData = () => {
    return fetch(`${BASE_URL}/friends`, {
        method: 'GET',
        headers: { 'x-user-id': localStorage.getItem('userId') || '-1' }
    });
};

export const sendFriendRequest = (targetUserId) => {
    return fetch(`${BASE_URL}/friends`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'x-user-id': localStorage.getItem('userId') || '-1' 
        },
        body: JSON.stringify({ targetUserId })
    });
};

export const acceptFriendRequest = (senderUserId) => {
    return fetch(`${BASE_URL}/friends/accept`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'x-user-id': localStorage.getItem('userId') || '-1' 
        },
        body: JSON.stringify({ senderUserId })
    });
};

export const deleteFriendConnection = (targetUserId) => {
    return fetch(`${BASE_URL}/friends/${targetUserId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': localStorage.getItem('userId') || '-1' }
    });
};