const users = require("../models/userData")

// GET /users
function getUsers(req, res) {
  let filtered = users
  if (userRole) {
    filtered = filtered.filter((u) => u.userRole === String(userRole))
  }

  const start = (Number(page) - 1) * Number(limit)
  const paginated = filtered.slice(start, start + Number(limit))

  res.json({
    success: true,
    data: { page: Number(page), limit: Number(limit), total: filtered.length, users: paginated },
    error: null,
  })
}

// GET /users/:id  —> centralized error handling
async function getUser(req, res, next) {
  try {
    const user = users.find((u) => u.id === Number(req.params.id))
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
function createUser(req, res) {
  const { firstName, lastName, userRole} = req.body
  const newUser = { id: users.length, firstName, lastName, userRole, 
    createDate: (new Date()).toISOString(), updateDate: (new Date()).toISOString() }
  users.push(newUser)
  res.status(201).json({ success: true, data: newUser.id, error: null })
}

module.exports = { getUsers, getUser, createUser }
