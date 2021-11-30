const { selectTopics } = require("../models/topics.model");

exports.getTopics = async (req, res, next) => {
  try {
    const topics = await selectTopics();

    if (topics.length > 0) {
      res.status(200).send({ topics });
    } else {
      next({ status: 204, msg: "No topics found" });
    }
  } catch (err) {
    next(err);
  }
};
