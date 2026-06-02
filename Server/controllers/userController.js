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

function login(req, res) {
    const { email, password } = req.body
    const user = users.find(u => u.email === email && u.password === password)
    if (user) {
        const { password, ...userWithoutPassword } = user; // Exclude password from response
        res.status(200).json({ success: true, data: { token: "mock-token", "user": userWithoutPassword }, error: null })
    } else {
        res.status(401).json({ success: false, data: null, error: "Invalid credentials" })
    }
}

function getCurrentUser(req, res, next) {
    const userId = Number(req.header("x-user-id"));
    const user = users.find((u) => u.userId === userId);
    if (!user) {
        res.status(404);
        const err = new Error("User not found", { requestedUserId: userId });
        next(err);
        return;
    }
    const { password, ...userWithoutPassword } = user;
    res.json({ success: true, data: userWithoutPassword, error: null });
}

/*function getUserNames(req, res, next) {
    const userIds = req.body.userIds; // Expecting an array of user IDs in the request body
    const userNames = users
        .filter(u => userIds.includes(u.userId))
        .map(u => ({ userId: u.userId, username: u.username }));
    res.json({ success: true, data: userNames, error: null });
}
    const userNames = users.map(u => ({ userId: u.userId, firstName: u.firstName, lastName: u.lastName }));
    res.json({ success: true, data: userNames, error: null });
}*/

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser, 
  login,
  getCurrentUser
}