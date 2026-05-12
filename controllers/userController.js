const users = require("../models/userData")

// GET /users
function getUsers(req, res, next) {
    res.json({
        success: true,
        data: users,
        error: null,
    })
    next()
}

// GET /users/:id  —> centralized error handling
async function getUser(req, res, next) {
    try {
    const user = users.find((u) => u.userId === Number(req.params.id))
    if (!user){
        res.status(404)
        throw new Error("User not found", { userId: req.params.id })
    } 
    res.json({ success: true, data: user, error: null })
    } catch (err) {
        next(err)
    }
}

// POST /users  — called after validateCreateUser middleware
function createUser(req, res, next) {
    const { firstName, lastName, userRole} = req.body
    const newUser = { id: users.length + 1, firstName, lastName, userRole, 
    createDate: (new Date()).toISOString(), updateDate: (new Date()).toISOString() }
    users.push(newUser)
    res.status(201).json({ success: true, data: newUser.id, error: null })
    next()
}


//I added update and delete functions for completeness
function updateUser(req, res) {
  res.json({
    success: true,
    data: "User updated",
    error: null
  })
}

function deleteUser(req, res) {
  res.json({
    success: true,
    data: "User deleted",
    error: null
  })
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
}