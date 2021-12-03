const express = require("express");

const router = express.Router();
const { getTopics, createTopic } = require("../controllers/topics.controller");

router.route("/").get(getTopics).post(createTopic);

module.exports = router;
