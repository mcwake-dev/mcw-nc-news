const express = require("express");
const { getUsers, getUser } = require("../controllers/users.controller");
const router = express.Router();

router.route("/").get(getUsers);
router.route("/:username").get(getUser);

module.exports = router;
