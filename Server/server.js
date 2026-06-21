const express = require("express")
const cors = require('cors');
const app = express()
const PORT = 3000
const http = require("http");
const { Server } = require("socket.io");
const setupGameSocket = require("./sockets/gameSocket");

app.use(cors({
    origin: 'http://localhost:5173', // Allow React app's specific port
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

app.use(express.json())

// will run last because of an event listener on 'finish'
const logger = require("./middleware/logger")
app.use(logger)

// routes
const userRoutes = require("./routes/users")
app.use("/users", userRoutes)

const matchRoutes = require("./routes/matches")
app.use("/matches", matchRoutes)

const appRoutes = require("./routes/appRoutes")
app.use("/api", appRoutes)

// must be just before logger and after all other routes
const errorHandler = require("./middleware/errorHandler")
app.use(errorHandler)

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

app.set("io", io);

setupGameSocket(io);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});