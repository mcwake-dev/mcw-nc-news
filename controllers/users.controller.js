const { selectUsers, selectUser } = require("../models/users.model");

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

exports.getUser = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await selectUser(username);

    if (user) {
      res.status(200).send({ user });
    } else {
      next({ status: 400, msg: "Users: User not found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.userExists = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await selectUser(username);

    if (user) {
      res.status(200).send({ exists: true });
    } else {
      res.status(200).send({ exists: false });
    }
  } catch (err) {
    next(err);
  }
};
