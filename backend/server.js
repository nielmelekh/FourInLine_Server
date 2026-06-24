const express = require("express");
const cors = require('cors');
const app = express();
const PORT = 3000;
const http = require("http");
const { Server } = require("socket.io");
const setupGameSocket = require("./src/sockets/gameSocket");

// Explicitly create an HTTP server wrapping your Express app
const server = http.createServer(app);

// Initializing Socket.io and attaching it to the server with its own CORS policy
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// Passing the initialized 'io' instance to the game logic
setupGameSocket(io);

// Enable CORS for standard Express API routes
app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true 
}));

app.use(express.json());

// will run last because of an event listener on 'finish'
const logger = require("./src/middleware/logger");
app.use(logger);

// routes
const userRoutes = require("./src/routes/users");
app.use("/users", userRoutes);

const matchRoutes = require("./src/routes/matches");
app.use("/matches", matchRoutes);

const friendRoutes = require("./src/routes/friendRoutes");
app.use("/friends", friendRoutes);

const appRoutes = require("./src/routes/appRoutes");
app.use("/api", appRoutes);

// must be just before logger and after all other routes
const errorHandler = require("./src/middleware/errorHandler");
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});