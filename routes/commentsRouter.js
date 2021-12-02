const express = require("express");

const router = express.Router();
const {
  deleteComment,
  voteOnComment,
} = require("../controllers/comments.controller");

router.route("/:comment_id").patch(voteOnComment).delete(deleteComment);

module.exports = router;
