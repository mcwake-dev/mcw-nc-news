const express = require("express");

const router = express.Router();
const { getCommits } = require("../controllers/github.controller");

router.route("/:project_name").get(getCommits);

module.exports = router;
