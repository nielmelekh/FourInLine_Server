import React, { useEffect, useState } from 'react';
import { 
    fetchFriendsData, 
    sendFriendRequest, 
    acceptFriendRequest, 
    deleteFriendConnection 
} from '../services/api';

const Friends = () => {
    const [friends, setFriends] = useState([]);
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadFriendsData = async () => {
        try {
            setLoading(true);
            const response = await fetchFriendsData();
            if (!response.ok) throw new Error('Failed to fetch friends data');
            
            const responseJson = await response.json();
            
            setFriends(responseJson.data.friends || []);
            setReceivedRequests(responseJson.data.pendingReceived || []);
            setSentRequests(responseJson.data.pendingSent || []);
            setAvailableUsers(responseJson.data.availableUsers || []);
        } catch (err) {
            setError('Could not load friends list.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFriendsData();
    }, []);

    const handleSendRequest = async (userId) => {
        await sendFriendRequest(userId);
        loadFriendsData(); 
    };

    const handleAcceptRequest = async (userId) => {
        await acceptFriendRequest(userId);
        loadFriendsData();
    };

    const handleRemoveOrDecline = async (userId) => {
        await deleteFriendConnection(userId);
        loadFriendsData();
    };

    if (loading) return <p style={{ textAlign: 'center', color: 'var(--muted)' }}>Loading friends...</p>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <h2 className="page-title" style={{ marginBottom: '30px' }}>Friends Network</h2>
            
            {error && <p style={{ color: 'var(--danger)', textAlign: 'center', fontWeight: 'bold' }}>{error}</p>}

            {/* 1. Pending Received Requests */}
            <div style={sectionStyle}>
                <h3 style={headerStyle}>
                    Received Invites
                </h3>
                {receivedRequests.length === 0 ? <p style={{ color: 'var(--muted)' }}>No pending invites.</p> : (
                    <ul style={listStyle}>
                        {receivedRequests.map(user => (
                            <li key={user.userId} style={listItemStyle}>
                                <span><strong>{user.username}</strong> wants to be your friend</span>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => handleAcceptRequest(user.userId)} style={{ background: 'var(--success)' }}>Accept</button>
                                    <button onClick={() => handleRemoveOrDecline(user.userId)} style={{ background: 'var(--danger)' }}>Decline</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* 2. Current Friends */}
            <div style={sectionStyle}>
                <h3 style={headerStyle}>
                    Current Friends
                </h3>
                {friends.length === 0 ? <p style={{ color: 'var(--muted)' }}>You haven't added any friends yet.</p> : (
                    <ul style={listStyle}>
                        {friends.map(user => (
                            <li key={user.userId} style={listItemStyle}>
                                <strong>{user.username}</strong>
                                <button onClick={() => handleRemoveOrDecline(user.userId)} style={{ background: 'var(--danger)' }}>Remove Friend</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* 3. Pending Sent Requests */}
            <div style={sectionStyle}>
                <h3 style={headerStyle}>
                    Sent Invites
                </h3>
                {sentRequests.length === 0 ? <p style={{ color: 'var(--muted)' }}>No invites sent.</p> : (
                    <ul style={listStyle}>
                        {sentRequests.map(user => (
                            <li key={user.userId} style={listItemStyle}>
                                <span>Waiting for <strong>{user.username}</strong> to respond...</span>
                                <button onClick={() => handleRemoveOrDecline(user.userId)} style={{ background: 'var(--warning)', color: '#111827' }}>Cancel Request</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* 4. Available Users */}
            <div style={sectionStyle}>
                <h3 style={headerStyle}>
                    Add New Friends
                </h3>
                {availableUsers.length === 0 ? <p style={{ color: 'var(--muted)' }}>No new users available to add.</p> : (
                    <ul style={listStyle}>
                        {availableUsers.map(user => (
                            <li key={user.userId} style={listItemStyle}>
                                <strong>{user.username}</strong>
                                {/* Notice this button has no inline style, so it automatically uses the primary gradient from App.css! */}
                                <button onClick={() => handleSendRequest(user.userId)}>Send Request</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

        </div>
    );
};

// --- Updated Styles using App.css Variables ---

const sectionStyle = {
    backgroundColor: 'var(--card)',     // Adapts to dark/light mode automatically
    padding: '24px',                    // Matched to your .game-card padding
    borderRadius: '24px',               // Matched to your .game-card border radius
    marginBottom: '30px',
    border: '1px solid var(--border)',  // Adapts to dark/light mode automatically
    boxShadow: 'var(--shadow)'          // Adds the nice drop shadow from your global CSS
};

const headerStyle = { 
    borderBottom: '2px solid var(--border)', 
    paddingBottom: '12px',
    marginTop: 0 
};

const listStyle = {
    listStyleType: 'none',
    padding: 0,
    margin: 0
};

const listItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 0',
    borderBottom: '1px solid var(--border)' // Adapts to dark/light mode automatically
};

export default Friends;