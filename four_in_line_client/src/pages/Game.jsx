import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../services/socket";

const Game = () => {
    const { gameId } = useParams();
    const [game, setGame] = useState(null);
    const [error, setError] = useState("");

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

        return () => {
            socket.off("gameUpdated");
            socket.off("gameError");
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

    return (
        <div style={{ textAlign: "center" }}>
            <h2>Real-Time Four In Line</h2>

            {error && (
            <p style={{ color: "red", fontWeight: "bold" }}>
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
            <p><strong>Current Turn:</strong> {game.currentTurn}</p>

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
        </div>
    );
};

export default Game;