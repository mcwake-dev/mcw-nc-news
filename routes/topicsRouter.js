const express = require("express");

const router = express.Router();
const { getTopics } = require("../controllers/topics.controller");

router.route("/").get(getTopics);

module.exports = router;
