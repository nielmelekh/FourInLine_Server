// Server/sockets/gameSocket.js

const games = {};

function createEmptyBoard() {
    return Array.from({ length: 6 }, () => Array(7).fill(null));
}

function getOpenGames() {
    return Object.values(games).filter(game => game.status === "waiting");
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
                status: "waiting"
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


        socket.on("makeMove", ({ gameId, column, userId }) => {
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

module.exports = setupGameSocket;