const express = require("express");

const router = express.Router();
const {
  deleteComment,
  voteOnComment,
  topThreeMostRecent,
  topThreeHighestVoted,
} = require("../controllers/comments.controller");

router.route("/recent").get(topThreeMostRecent);
router.route("/highest").get(topThreeHighestVoted);
router.route("/:comment_id").patch(voteOnComment).delete(deleteComment);

module.exports = router;
