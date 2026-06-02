const express = require("express")
const cors = require('cors');
const app = express()
const PORT = 5173

// Enable CORS for all routes (Must be before route definitions)
app.use(cors({
    origin: 'http://localhost:3000', // Allow React app's specific port
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true // Important when sending tokens or cookies
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})