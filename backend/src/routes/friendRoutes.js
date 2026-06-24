const express = require("express");
const router = express.Router();
const friendController = require("../controllers/friendController");

router.get("/", friendController.getFriendsData);
router.post("/", friendController.sendFriendRequest);
router.put("/accept", friendController.acceptFriendRequest);
router.delete("/:id", friendController.deleteFriendConnection);

module.exports = router;