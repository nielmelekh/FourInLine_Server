const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const {authorizeRoles, authorizeUser} = require("../middleware/auth");
const { validateUserId, validateUserBody } = require("../middleware/validateUser");

router.get("/", authorizeRoles("admin", "manager"), userController.getUsers);

router.get("/:id", authorizeUser, validateUserId, userController.getUser);

router.post(
  "/",
  authorizeRoles("admin", "manager"),
  validateUserBody,
  userController.createUser
);

router.put(
  "/:id",
  authorizeUser,
  validateUserId,
  validateUserBody,
  userController.updateUser
);

router.delete(
  "/:id",
  authorizeRoles("admin"),
  validateUserId,
  userController.deleteUser
);

module.exports = router;