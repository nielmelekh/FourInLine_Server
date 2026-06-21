const express = require("express");
const router = express.Router();

const matchController = require("../controllers/matchController");
const {authorizeRoles, authorizeMatchAccess} = require("../middleware/auth");
const { validateMatchExists, validateMatchBody } = require("../middleware/validateMatch");

router.get("/", authorizeRoles("admin", "manager"), matchController.getMatches);

router.get("/:id", authorizeMatchAccess, matchController.getMatch);

router.post(
  "/",
  authorizeRoles("admin", "manager"),
  validateMatchBody,
  matchController.createMatch
);

router.put(
  "/:id",
  authorizeRoles("admin", "manager"),
  matchController.updateMatch
);

router.delete(
  "/:id",
  authorizeRoles("admin"),
  validateMatchExists,
  matchController.deleteMatch
);

module.exports = router;