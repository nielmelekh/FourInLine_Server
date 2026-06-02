const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const matchController = require("../controllers/matchController");
const {authorizeRoles, authorizeUser} = require("../middleware/auth");
const { validateUserId, validateUserBody } = require("../middleware/validateUser");

router.post("/auth/login", userController.login) // login route
router.get("/matches", matchController.getUserMatches) // Get matches for the logged-in user
router.get("/users/me", userController.getCurrentUser) // Get current user info

module.exports = router;