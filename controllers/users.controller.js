const { selectUsers } = require("../models/users.model");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await selectUsers();

    if (users.length > 0) {
      res.status(200).send({ users });
    } else {
      next({ msg: "Users: No users found" });
    }
  } catch (err) {
    next(err);
  }
};
