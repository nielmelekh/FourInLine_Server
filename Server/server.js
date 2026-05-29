const express = require("express")
const app = express()
const PORT = 3000

app.use(express.json())

// will run last because of an event listener on 'finish'
const logger = require("./middleware/logger")
app.use(logger)

// routes
const userRoutes = require("./routes/users")
app.use("/users", userRoutes)

const matchRoutes = require("./routes/matches")
app.use("/matches", matchRoutes)

// must be just before logger and after all other routes
const errorHandler = require("./middleware/errorHandler")
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})