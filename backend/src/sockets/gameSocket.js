// Server/sockets/gameSocket.js

const { prisma } = require("../../models/prismaClient.js");
const { analyzeMatch } = require("../services/aiService.js")

const games = {};

function createEmptyBoard() {
    return Array.from({ length: 6 }, () => Array(7).fill(null));
}

function getOpenGames() {
    return Object.values(games).filter(game => game.status === "waiting");
}

function checkWinner(board) {
    const rows = 6;
    const cols = 7;

    // Check Horizontal
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols - 3; c++) {
            if (board[r][c] && board[r][c] === board[r][c+1] && board[r][c] === board[r][c+2] && board[r][c] === board[r][c+3]) {
                return board[r][c]; // Returns "red" or "yellow"
            }
        }
    }
    // Check Vertical
    for (let r = 0; r < rows - 3; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c] && board[r+1][c] === board[r][c] && board[r+2][c] === board[r][c] && board[r+3][c] === board[r][c]) {
                return board[r][c];
            }
        }
    }
    // Check Diagonal Right-Down (\)
    for (let r = 0; r < rows - 3; r++) {
        for (let c = 0; c < cols - 3; c++) {
            if (board[r][c] && board[r+1][c+1] === board[r][c] && board[r+2][c+2] === board[r][c] && board[r+3][c+3] === board[r][c]) {
                return board[r][c];
            }
        }
    }
    // Check Diagonal Right-Up (/)
    for (let r = 3; r < rows; r++) {
        for (let c = 0; c < cols - 3; c++) {
            if (board[r][c] && board[r-1][c+1] === board[r][c] && board[r-2][c+2] === board[r][c] && board[r-3][c+3] === board[r][c]) {
                return board[r][c];
            }
        }
    }
    return null;
}

// Check if the board is completely full without a winner
function checkDraw(board) {
    return board[0].every(cell => cell !== null);
}

function setupGameSocket(io) {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("startGame", ({ userId, username }) => {
            const gameId = Date.now().toString();

            games[gameId] = {
                gameId,
                board: createEmptyBoard(),
                players: [
                    { socketId: socket.id, userId, username, color: "red" }
                ],
                currentTurn: "red",
                status: "waiting",
                startTime: new Date().toISOString(),
                moveHistory: [] // Initialize move history for AI analysis
            };

            socket.join(`game_${gameId}`);

            socket.emit("gameStarted", games[gameId]);
            io.emit("openGamesUpdated", getOpenGames());
        });

        socket.on("getOpenGames", () => {
            socket.emit("openGamesUpdated", getOpenGames());
        });

        socket.on("joinGame", ({ gameId, userId, username }) => {
            const game = games[gameId];

            if (!game) {
                socket.emit("gameError", "Game not found");
                return;
            }

            if (game.status !== "waiting" || game.players.length >= 2) {
                socket.emit("gameError", "Game is already full");
                return;
            }

            game.players.push({
                socketId: socket.id,
                userId,
                username,
                color: "yellow"
            });

            game.status = "playing";

            socket.join(`game_${gameId}`);

            io.to(`game_${gameId}`).emit("gameUpdated", game);
            io.emit("openGamesUpdated", getOpenGames());
        });

        socket.on("watchGame", ({ gameId, userId }) => {
            const game = games[gameId];

            if (!game) {
                socket.emit("gameError", "Game not found");
                return;
            }

            const player = game.players.find(p => Number(p.userId) === Number(userId));

            if (player) {
                player.socketId = socket.id;
            }

            socket.join(`game_${gameId}`);
            socket.emit("gameUpdated", game);
        });


        socket.on("makeMove", async ({ gameId, column, userId }) => {
            const game = games[gameId];

            if (!game || game.status !== "playing") {
                socket.emit("gameError", "Game is not available");
                return;
            }

            const player = game.players.find(p => Number(p.userId) === Number(userId));

            if (!player) {
                socket.emit("gameError", "You are not part of this game");
                return;
            }

            if (player.color !== game.currentTurn) {
                socket.emit("gameError", "It is not your turn");
                return;
            }

            for (let row = 5; row >= 0; row--) {
                if (game.board[row][column] === null) {
                    game.board[row][column] = player.color;
                    game.moveHistory.push(column); // Record the move for AI analysis

                    // Check for a winner after the move
                    const winnerColor = checkWinner(game.board);
                    
                    if (winnerColor) {
                        game.status = "finished";
                        game.winner = winnerColor;
                    }

                    // Check for a draw after the move
                    if (checkDraw(game.board)) {
                        game.status = "finished";
                        game.winner = "draw";
                    }

                    if (game.status === "finished") {
                        game.currentTurn = null;
                        game.endTime = new Date().toISOString(); // Set end time when the game finishes
                        await saveMatchToDatabase(game); // Save match result to the database

                        io.to(`game_${gameId}`).emit("gameUpdated", game);
                        const isDraw = game.winner === "draw";
                        const winnerIsPlayer1 = game.winner === "red"; // Red is always Player 1 in your setup

                        const analysis = await analyzeMatch(game.moveHistory, isDraw, winnerIsPlayer1);

                        io.to(`game_${gameId}`).emit("coachAnalysis", {
                            boardAnalysis: analysis.board_analysis,
                            praise: analysis.winner_praise,
                            tip: analysis.loser_tip
                        });
                        return;
                    }

                    // Switch turns
                    game.currentTurn = player.color === "red" ? "yellow" : "red";

                    io.to(`game_${gameId}`).emit("gameUpdated", game);
                    return;
                }
            }

            socket.emit("gameError", "Column is full");
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
}

async function saveMatchToDatabase(game) {
    try {
        const match = await prisma.match.create({
            data: {
                player1Id: Number(game.players[0].userId),
                player2Id: Number(game.players[1].userId),
                result: game.winner == "red" ? 1 : (game.winner === "yellow" ? 2 : 0),
                startTime: game.startTime,
                endTime: game.endTime
            }
        });
        return true;
    } catch (error) {
        console.error("Failed to save match to DB:", error);
        return false; // Prevents the server from crashing
    }
}

module.exports = setupGameSocket;