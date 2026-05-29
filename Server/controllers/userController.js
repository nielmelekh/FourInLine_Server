//const { use } = require("react")
const users = require("../models/userData").users

// GET /users
function getUsers(req, res, next) {
    res.json({
        success: true,
        data: users,
        error: null,
    })
    next()
}

// GET /users/:id
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
    const newUser = { userId: users.length + 1, firstName, lastName, userRole, 
    createDate: (new Date()).toISOString(), updateDate: (new Date()).toISOString() }
    users.push(newUser)
    res.status(201).json({ success: true, data: newUser.userId, error: null })
    next()
}


//PUT /users/:id  — called after validateExistingUser middleware
function updateUser(req, res) {
    const userId = Number(req.params.id)
    const { firstName, lastName, userRole} = req.body
    users[userId - 1] = { userId, firstName, lastName, userRole, 
    createDate: users[userId - 1].createDate, updateDate: (new Date()).toISOString() }
    res.status(200).json({
        success: true,
        data: userId,
        error: null
    })
}

// DELETE /users/:id — called after validateExistingUser middleware
function deleteUser(req, res) {
    const userId = Number(req.params.id)
    users.splice(userId - 1, 1)
    res.status(200).json({
        success: true,
        data: userId,
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