const express = require("express")
const app = express()
const PORT = 3000

app.use(express.json())

// routes
const userRoutes = require("./routes/users")
app.use("/users", userRoutes)

// must be just before logger and after all other routes
const errorHandler = require("./middleware/errorHandler")
app.use(errorHandler)

// must be last
const logger = require("./middleware/logger")
app.use(logger)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})