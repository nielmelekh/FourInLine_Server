// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { fetchMatches } from '../services/api';
import Card from '../components/Card';
import Table from '../components/Table';

const Dashboard = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const userId = Number(localStorage.getItem('userId')); // Get user ID from localStorage, default to -1 if not found
                const response = await fetchMatches(userId); // Fetch matches for the logged-in user [cite: 47]
                if (!response.ok) throw new Error('Failed to fetch data');
                const responseJson = await response.json();
                const formattedMatches = responseJson.data.map(match => {
                    return {
                        ...match, // Keep all the other properties exactly the same
                        // Overwrite the MatchDate property with a human-readable version
                        matchDate: new Date(match.matchDate).toLocaleString('en-GB'),
                        matchResult: match.matchResult === 'Draw' ? 'Draw' : 
                        ((match.matchResult === 'Player1Wins' && match.player1Id === userId) || 
                        (match.matchResult === 'Player2Wins' && match.player2Id === userId)) ? 
                        'Victory' : 'Defeat'
                    }
                });
                setMatches(formattedMatches);
            } catch (err) {
                setError('Could not load matches.');
                setMatches([]);
            } finally {
                setLoading(false); // Display loading state
            }
        };
        loadData();
    }, []);

    if (loading) return <p>Loading dashboard...</p>;
    if (matches.length === 0) return <p>No matches available at the moment.</p>; // Handle empty states

    return (
        <div>
            <h2 style = {{ textAlign: 'center' }}>Match Dashboard</h2>
            {error && <p style={{ color: 'orange' }}>{error}</p>}
            
            <h3 style = {{ textAlign: 'center' }}>Featured Matches</h3>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', alignItems: 'center', justifyContent: 'center' }}>
                {/* Cards used at least 3 times */}
                {
                    // latest matches
                    localStorage.getItem('dashboardShowCards') === 'latest' ?
                    [...matches].sort((a, b) => new Date(b.matchDate) - new Date(a.matchDate)).slice(0, 3).map(match => (
                        <Card key={match.id} title={"Latest Match"} player1={match.player1Username} player2={match.player2Username} result={match.matchResult}>
                        </Card>
                    )) :
                    // best matches for different criteria 
                    [...matches].filter(match => match.matchResult === 'Victory').sort((a, b) => new Date(b.matchDate) - new Date(a.matchDate)).slice(0, 1).map(match => (
                    <Card key={match.id} title={"Latest Victory"} player1={match.player1Username} player2={match.player2Username} result={match.matchResult}>
                        <p>Match Date: <br/>{match.matchDate}</p>
                    </Card>
                )).concat([...matches].sort((a, b) => new Date(b.matchDurationSeconds) - new Date(a.matchDurationSeconds)).slice(0, 1).map(match => (
                    <Card key={match.id} title={"Longest Match"} player1={match.player1Username} player2={match.player2Username} result={match.matchResult}>
                        <p>Match Duration:<br/>{match.matchDurationSeconds} seconds</p>
                    </Card>
                ))).concat([...matches].sort((a, b) => new Date(a.matchDurationSeconds) - new Date(b.matchDurationSeconds)).slice(0, 1).map(match => (
                    <Card key={match.id} title={"Shortest Match"} player1={match.player1Username} player2={match.player2Username} result={match.matchResult}>
                        <p>Match Duration:<br/>{match.matchDurationSeconds} seconds</p>
                    </Card>
                )))
                }
            </div>

            <h3>Match Table</h3>
            <Table data={matches.sort((a, b) => new Date(b.matchDate) - new Date(a.matchDate))} 
             columns={{ player1Username: 'Player 1', player2Username: 'Player 2', matchDate: 'Match Date', matchResult: 'Result', matchDurationSeconds: 'Duration (Seconds)' }} />
        </div>
    );
};

export default Dashboard;