const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
//const { validateCreateUser } = require("../middleware/validate")

// GET /users?age=&page=&limit=  — filtering + pagination (slide 17)
router.get("/", userController.getUsers)

// GET /users/:id  — retrieve a specific user (slide 10)
router.get("/:id", userController.getUser)

// POST /users  — validate body, then create
router.post("/", /*validateCreateUser,*/ userController.createUser)

module.exports = router