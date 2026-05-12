const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const {authorizeRoles, authorizeUser} = require("../middleware/auth");
const { validateId, validateUserBody } = require("../middleware/validateUser");

router.get("/", authorizeRoles("admin", "manager"), userController.getUsers);

router.get("/:id", authorizeUser, validateId, userController.getUser);

router.post(
  "/",
  authorizeRoles("admin", "manager"),
  validateUserBody,
  userController.createUser
);

router.put(
  "/:id",
  authorizeUser,
  validateId,
  validateUserBody,
  userController.updateUser
);

router.delete(
  "/:id",
  authorizeRoles("admin"),
  validateId,
  userController.deleteUser
);

module.exports = router;