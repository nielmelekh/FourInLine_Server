const express = require("express");
const router = express.Router();

const matchController = require("../controllers/matchController");
const {authorizeRoles, authorizeMatchAccess} = require("../middleware/auth");
const { validateMatchId, validateMatchBody } = require("../middleware/validateMatch");

router.get("/", authorizeRoles("admin", "manager"), matchController.getMatches);

router.get("/:id", authorizeMatchAccess, validateMatchId, matchController.getMatch);

router.post(
  "/",
  authorizeRoles("admin", "manager"),
  validateMatchBody,
  matchController.createMatch
);

router.put(
  "/:id",
  authorizeRoles("admin", "manager"),
  validateMatchId,
  validateMatchBody,
  matchController.updateMatch
);

router.delete(
  "/:id",
  authorizeRoles("admin"),
  validateMatchId,
  matchController.deleteMatch
);

module.exports = router;