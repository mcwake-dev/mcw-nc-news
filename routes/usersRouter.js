const express = require("express");
const {
  getUsers,
  getUser,
  userExists,
} = require("../controllers/users.controller");

const router = express.Router();

router.route("/").get(getUsers);
router.route("/:username").get(getUser);
router.route("/exists/:username").get(userExists);

module.exports = router;
