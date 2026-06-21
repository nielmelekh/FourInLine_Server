// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMatches } from '../services/api';
import Card from '../components/Card';
import Table from '../components/Table';
import { socket } from '../services/socket';

const Dashboard = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openGames, setOpenGames] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        socket.connect();

        socket.emit("getOpenGames");

        socket.on("gameStarted", (game) => {
            navigate(`/game/${game.gameId}`);
        });

        socket.on("openGamesUpdated", (games) => {
            setOpenGames(games);
        });

        const loadData = async () => {
            try {
                const userId = Number(localStorage.getItem('userId'));
                const response = await fetchMatches(userId);

                if (!response.ok) throw new Error('Failed to fetch data');

                const responseJson = await response.json();

                const formattedMatches = responseJson.data.map(match => ({
                    ...match,
                    matchDate: new Date(match.matchDate).toLocaleString('en-GB'),
                    matchResult: match.matchResult === 'Draw' ? 'Draw' :
                        ((match.matchResult === 'Player1Wins' && match.player1Id === userId) ||
                        (match.matchResult === 'Player2Wins' && match.player2Id === userId)) ?
                        'Victory' : 'Defeat'
                }));

                setMatches(formattedMatches);
            } catch (err) {
                setError('Could not load matches.');
                setMatches([]);
            } finally {
                setLoading(false);
            }
        };

        loadData();

        return () => {
            socket.off("gameStarted");
            socket.off("openGamesUpdated");
            socket.disconnect();
        };
    }, [navigate]);

    const startGame = () => {
        socket.emit("startGame", {
            userId: Number(localStorage.getItem("userId")),
            username: localStorage.getItem("username") || "Player"
        });
    };

    const joinGame = (gameId) => {
        socket.emit("joinGame", {
            gameId,
            userId: Number(localStorage.getItem("userId")),
            username: localStorage.getItem("username") || "Player"
        });

        navigate(`/game/${gameId}`);
    };

    if (loading) return <p>Loading dashboard...</p>;

    return (
        <div>
            <h2 style={{ textAlign: 'center' }}>Match Dashboard</h2>
            {error && <p style={{ color: 'orange' }}>{error}</p>}

            <div style={{ textAlign: "center", marginBottom: "30px" }}>
                <h3>Real-Time Game</h3>

                <button onClick={startGame}>
                    Start Game
                </button>

                <h4>Open Games</h4>

                {openGames.length === 0 ? (
                    <p>No open games right now.</p>
                ) : (
                    openGames.map(game => (
                        <div key={game.gameId} style={{ margin: "10px" }}>
                            <span>
                                Game {game.gameId} by {game.players[0]?.username}
                            </span>

                            <button
                                style={{ marginLeft: "10px" }}
                                onClick={() => joinGame(game.gameId)}
                            >
                                Join Game
                            </button>
                        </div>
                    ))
                )}
            </div>

            <h3 style={{ textAlign: 'center' }}>Featured Matches</h3>

            {matches.length === 0 ? (
                <p style={{ textAlign: 'center' }}>No matches available at the moment.</p>
            ) : (
                <>
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', alignItems: 'center', justifyContent: 'center' }}>
                        {
                            localStorage.getItem('dashboardShowCards') === 'latest' ?
                            [...matches].sort((a, b) => new Date(b.matchDate) - new Date(a.matchDate)).slice(0, 3).map(match => (
                                <Card key={match.matchId} title={"Latest Match"} player1={match.player1Username} player2={match.player2Username} result={match.matchResult} />
                            )) :
                            [...matches].filter(match => match.matchResult === 'Victory').sort((a, b) => new Date(b.matchDate) - new Date(a.matchDate)).slice(0, 1).map(match => (
                                <Card key={match.matchId} title={"Latest Victory"} player1={match.player1Username} player2={match.player2Username} result={match.matchResult}>
                                    <p>Match Date: <br />{match.matchDate}</p>
                                </Card>
                            )).concat([...matches].sort((a, b) => b.matchDurationSeconds - a.matchDurationSeconds).slice(0, 1).map(match => (
                                <Card key={match.matchId} title={"Longest Match"} player1={match.player1Username} player2={match.player2Username} result={match.matchResult}>
                                    <p>Match Duration:<br />{match.matchDurationSeconds} seconds</p>
                                </Card>
                            ))).concat([...matches].sort((a, b) => a.matchDurationSeconds - b.matchDurationSeconds).slice(0, 1).map(match => (
                                <Card key={match.matchId} title={"Shortest Match"} player1={match.player1Username} player2={match.player2Username} result={match.matchResult}>
                                    <p>Match Duration:<br />{match.matchDurationSeconds} seconds</p>
                                </Card>
                            )))
                        }
                    </div>

                    <h3>Match Table</h3>

                    <Table
                        data={[...matches].sort((a, b) => new Date(b.matchDate) - new Date(a.matchDate))}
                        columns={{
                            player1Username: 'Player 1',
                            player2Username: 'Player 2',
                            matchDate: 'Match Date',
                            matchResult: 'Result',
                            matchDurationSeconds: 'Duration (Seconds)'
                        }}
                    />
                </>
            )}
        </div>
    );
};

export default Dashboard;