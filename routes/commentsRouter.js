const express = require("express");
const router = express.Router();
const { deleteComment } = require("../controllers/comments.controller");

router.route("/:comment_id").delete(deleteComment);

module.exports = router;
