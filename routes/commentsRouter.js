const express = require("express");

const router = express.Router();
const {
  deleteComment,
  voteOnComment,
  topThreeMostRecent,
} = require("../controllers/comments.controller");

router.route("/recent").get(topThreeMostRecent);
router.route("/:comment_id").patch(voteOnComment).delete(deleteComment);

module.exports = router;
