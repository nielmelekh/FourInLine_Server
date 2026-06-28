
const { prisma } = require("../../models/prismaClient")

// GET /users
async function getUsers(req, res, next) {
    try {
        const users = await prisma.user.findMany({
            omit: { password: true }  // Exclude password from the response
        })
        res.json({
            success: true,
            data: users,
            error: null,
        })
    } catch (err) {
        next(err)
    }
}

// GET /users/:id
async function getUser(req, res, next) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                userId: Number(req.params.id)
            }
        })
        if (!user){
            res.status(404)
            throw new Error("User not found", { userId: req.params.id })
        } 
        // Exclude password from response
        const { password, ...userWithoutPassword } = user;
        res.json({ success: true, data: userWithoutPassword, error: null })
    } catch (err) {
        next(err)
    }
}

// POST /users  — called after validateCreateUser middleware
async function createUser(req, res, next) {
    try {
        const { firstName, lastName, email, password, userRole} = req.body
        const newUser = await prisma.user.create({
            data: {
                firstName: firstName,
                lastName: lastName,
                username: firstName + lastName,
                email: email,
                password: password,
                userRole: userRole
            }
        })
        // Exclude password from response
        const { password: dbPassword, ...userWithoutPassword } = newUser;
        res.status(201).json({ success: true, data: userWithoutPassword, error: null })
        next()
    } catch (err) {
        next(err)
    }
}


//PUT /users/:id  — called after validateExistingUser middleware
async function updateUser(req, res, next) {
    try {
        const userId = Number(req.params.id);

        const { 
            firstName, 
            lastName, 
            username, 
            userRole, 
            theme, 
            dashboardShowCards 
        } = req.body;

        // Prisma safely ignores any field that is 'undefined', meaning if the frontend 
        // only sends { theme: "dark" }, the other 5 columns remain completely untouched.
        const updateData = {
            firstName: firstName,
            lastName: lastName,
            username: username,
            userRole: userRole,
            theme: theme,
            dashboardShowCards: dashboardShowCards
        };

        // Execute the Prisma update
        const updatedUser = await prisma.user.update({
            where: { userId: userId },
            data: updateData
        });

        // Exclude password from response
        const { password, ...userWithoutPassword } = updatedUser;
        res.status(200).json({
            success: true,
            data: userWithoutPassword, 
            error: null
        });

    } catch (err) {
        next(err);
    }
}

// DELETE /users/:id — called after validateExistingUser middleware
async function deleteUser(req, res, next) {
    try{
        const userId = Number(req.params.id)
        const deletedUser = await prisma.user.delete({
            where: { userId: userId }
        })
        res.status(200).json({
            success: true,
            data: userId,
            error: null
        })
    } catch (err) {
        next(err)
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body
        const user = await prisma.user.findFirst({
            where: {
                email: email,
                password: password
            }
        })
        if (user) {
            const { password: dbPassword, ...userWithoutPassword } = user; // Exclude password from response
            res.status(200).json({ success: true, data: { token: "mock-token", "user": userWithoutPassword }, error: null })
        } else {
            res.status(401);
            throw new Error("Invalid email or password", { email: email });
        }
    } catch (err) {
        next(err)
    }
}

function logout(req, res, next) {
    // Implementation for logout functionality
    return res.status(200).json({ success: true, message: "User logged out successfully", error: null });
}

async function getCurrentUser(req, res, next) {
    try {
        const userId = Number(req.header("x-user-id"));
        const user = await prisma.user.findUnique({
            where: {
                userId: Number(userId)
            }
        })
        if (!user){
            res.status(404)
            throw new Error("User not found", { userId: userId })
        }
        // Exclude password from response
        const { password, ...userWithoutPassword } = user;
        res.status(200).json({ success: true, data: userWithoutPassword, error: null })
    } catch (err) {
        next(err)
    }
}

async function getSettings(req, res, next) {
    try {
        const userId = Number(req.header("x-user-id"));
        const user = await prisma.user.findUnique({
            where: {
                userId: userId
            },
            select: {
                username: true,
                dashboardShowCards: true,
                theme: true
            }
        });
        if (!user) {
            res.status(404);
            throw new Error("User not found For Settings", { requestedUserId: userId });
        }
        res.status(200).json({ success: true, 
            data: { username: user.username, 
                dashboardShowCards: user.dashboardShowCards, 
                theme: user.theme }, 
            error: null });
    } catch (err) {
        next(err);
    }
}

async function updateSettings(req, res, next) {
    try{
        const userId = Number(req.header("x-user-id"));
        const { username, dashboardShowCards, theme } = req.body;
        const updatedUser = await prisma.user.update({
            where: { userId: userId },
            data: {
                username: username,
                dashboardShowCards: dashboardShowCards,
                theme: theme
            }
        });

        if (!updatedUser) {
            res.status(404);
            throw new Error("User not found For Settings", { requestedUserId: userId });
        }
        res.status(200).json({ success: true, 
            data: { username: updatedUser.username, 
                dashboardShowCards: updatedUser.dashboardShowCards, 
                theme: updatedUser.theme }, 
            error: null });    
        } catch (err) {
        next(err);
    }
}

//new
async function register(req, res, next) {
    try {

        const {
            firstName,
            lastName,
            username,
            email,
            password
        } = req.body;

        if (!firstName || !lastName || !username || !email || !password) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields"
            });
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ]
            }
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: "Username or email already exists"
            });
        }

        const newUser = await prisma.user.create({
            data: {
                firstName,
                lastName,
                username,
                email,
                password,
                userRole: "user"
            }
        });

        const { password: dbPassword, ...userWithoutPassword } = newUser;

        res.status(201).json({
            success: true,
            data: userWithoutPassword,
            error: null
        });

    } catch (err) {
        next(err);
    }
}

//end

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser, 
  login,
  logout,
  register,
  getCurrentUser,
  getSettings,
  updateSettings
}