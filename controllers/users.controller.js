const {
  selectUsers,
  selectUser,
  createUser,
} = require("../models/users.model");
const log = require("../log");
const { encryptPassword } = require("../utils/password");
const Joi = require("joi");
const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().alphanum().min(8).max(30).required(),
  firstName: Joi.string().min(2).max(50).required(),
  surname: Joi.string().min(2).max(50).required(),
  avatar_url: Joi.string()
    .uri({ scheme: ["http", "https"] })
    .required(),
});

exports.getUsers = async (req, res, next) => {
  const logger = log.getLogger("User Controller > getUsers");
  try {
    logger.info("Attemping to retrieve all users");

    const users = await selectUsers();

    if (users.length > 0) {
      logger.info(`Retrieved ${users.length} users`);
      res.status(200).send({ users });
    } else {
      logger.info(`No users found`);
      next({ msg: "Users: No users found" });
    }
  } catch (err) {
    logger.error(`Error occurred: ${err}`);
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  const logger = log.getLogger("User Controller > getUser");
  try {
    logger.info("Attemping to get single user details");

    const { username } = req.params;
    const user = await selectUser(username);

    if (user) {
      logger.info("User found");
      delete user.password;
      res.status(200).send({ user });
    } else {
      logger.warn("User not found");
      next({ status: 400, msg: "Users: User not found" });
    }
  } catch (err) {
    logger.error(`Error occurred: ${err}`);
    next(err);
  }
};

exports.userExists = async (req, res, next) => {
  const logger = log.getLogger("User Controller > userExists");

  try {
    logger.info("Attempting to check if user exists");

    const { username } = req.params;
    const user = await selectUser(username);

    if (user) {
      logger.info("User exists");
      res.status(200).send({ exists: true });
    } else {
      logger.info("User does not exist");
      res.status(200).send({ exists: false });
    }
  } catch (err) {
    await userSchema.validateAsync({});
    logger.error(`Error occurred: ${err}`);
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  const logger = log.getLogger("User Controller > createUser");

  try {
    logger.info("Attempting to create new user");

    const { username, firstName, surname, password, avatar_url } = req.body;

    logger.info("Validating schema...");
    await userSchema.validateAsync({
      username,
      firstName,
      surname,
      password,
      avatar_url,
    });

    logger.info("Encrypting password...");
    const encryptedPassword = await encryptPassword(password);

    logger.info("Creating user");
    const newUser = await createUser(
      username,
      firstName,
      surname,
      encryptedPassword,
      avatar_url
    );

    logger.info("User created");
    delete newUser.password;
    res.status(201).send({ user: newUser });
  } catch (err) {
    logger.error(`Error occurred: ${JSON.stringify(err)}`);
    next({ status: 400, err });
  }
};
