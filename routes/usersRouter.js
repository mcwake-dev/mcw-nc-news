const express = require("express");
const {
  getUsers,
  getUser,
  userExists,
  createUser,
} = require("../controllers/users.controller");

const router = express.Router();

router.route("/").get(getUsers).post(createUser);
router.route("/:username").get(getUser);
router.route("/exists/:username").get(userExists);

module.exports = router;
