import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../services/socket";

const Game = () => {
    const { gameId } = useParams();
    const [game, setGame] = useState(null);
    const [error, setError] = useState("");
    const [coachAdvice, setCoachAdvice] = useState(null);

    useEffect(() => {
        socket.connect();

        socket.emit("watchGame", {
            gameId,
            userId: Number(localStorage.getItem("userId"))
        });

        socket.on("gameUpdated", (updatedGame) => {
            setGame(updatedGame);
            setError("");
        });

        socket.on("gameError", (message) => {
            setError(message);
        });

        socket.on("coachAnalysis", (analysis) => {
            setCoachAdvice(analysis);
        });

        return () => {
            socket.off("gameUpdated");
            socket.off("gameError");
            socket.off("coachAnalysis");
            socket.disconnect();
        };
    }, [gameId]);

    const makeMove = (column) => {
        socket.emit("makeMove", {
            gameId,
            column,
            userId: Number(localStorage.getItem("userId"))
        });
    };

    if (!game) return <p style={{ textAlign: "center" }}>Loading game...</p>;

    const currentUserId = Number(localStorage.getItem("userId"));
    const currentPlayer = game.players.find(
        p => Number(p.userId) === currentUserId
    );

    const isWinner = currentPlayer && game.winner === currentPlayer.color;
    const isDraw = game.winner === "draw";
    const isLoser = currentPlayer && !isWinner && !isDraw;

    return (
        <div style={{ textAlign: "center" }}>
            <h2>Real-Time Four In Line</h2>

            {error && (
                <p style={{ color: "red", fontWeight: "bold", padding: "10px", border: "1px solid red", borderRadius: "5px", display: "inline-block" }}>
                    {error}
                </p>
            )}

            <p><strong>Game ID:</strong> {game.gameId}</p>
            
            <p>
                <strong>You are:</strong> {currentPlayer?.color || "viewer"}
            </p>

            <p>
                <strong>Players:</strong> {" "}
                {game.players.map(p => `${p.username} (${p.color})`).join(" vs ")}
            </p>

            <p><strong>Status:</strong> {game.status}</p>
            
            {/* Display the winner or a draw when the game finishes */}
            {game.status === "finished" && (
                <h3 style={{ color: game.winner === "draw" ? "black" : game.winner }}>
                    {game.winner === "draw" ? "The game is a Draw!" : `${game.winner.toUpperCase()} WINS!`}
                </h3>
            )}
            
            {/* Hide current turn if the game is over */}
            {game.status !== "finished" && (
                <p><strong>Current Turn:</strong> {game.currentTurn}</p>
            )}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 55px)",
                    gap: "6px",
                    justifyContent: "center",
                    marginTop: "20px"
                }}
            >
                {game.board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <button
                            key={`${rowIndex}-${colIndex}`}
                            onClick={() => makeMove(colIndex)}
                            style={{
                                width: "55px",
                                height: "55px",
                                borderRadius: "50%",
                                background:
                                    cell === "red"
                                        ? "red"
                                        : cell === "yellow"
                                        ? "gold"
                                        : "white",
                                border: "2px solid #333"
                            }}
                        />
                    ))
                )}
            </div>

            {game.status === "finished" && currentPlayer && (
                <div style={{ 
                    marginTop: "30px", 
                    padding: "20px", 
                    border: "2px solid #ccc", 
                    borderRadius: "8px", 
                    backgroundColor: "#f9f9f9", 
                    maxWidth: "500px", 
                    margin: "30px auto" 
                }}>
                    <h3 style={{ color: "black" }}>Post-Match AI Coach</h3>
                    
                    {!coachAdvice ? (
                        <p style={{ fontStyle: "italic", color: "gray" }}>
                            Loading coach advice...
                        </p>
                    ) : (
                        <div style={{ textAlign: "left" }}>
                            <p style={{ color: "black" }}><strong>Board Analysis:</strong> {coachAdvice.boardAnalysis}</p>
                            
                            {/* If they won, show praise */}
                            {isWinner && (
                                <p style={{ color: "green" }}><strong>Praise:</strong> {coachAdvice.praise}</p>
                            )}
                            
                            {/* If they lost, show the tip */}
                            {isLoser && (
                                <p style={{ color: "red" }}><strong>Tip:</strong> {coachAdvice.tip}</p>
                            )}

                            {/* If it's a draw, show both! */}
                            {isDraw && (
                                <>
                                    <p style={{ color: "green" }}><strong>Praise:</strong> {coachAdvice.praise}</p>
                                    <p style={{ color: "blue" }}><strong>Tip:</strong> {coachAdvice.tip}</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};

export default Game;