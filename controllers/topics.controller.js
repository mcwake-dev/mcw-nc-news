const { selectTopics, insertTopic } = require("../models/topics.model");

exports.getTopics = async (req, res, next) => {
  try {
    const topics = await selectTopics();

    res.status(200).send({ topics });
  } catch (err) {
    next(err);
  }
};

exports.createTopic = async (req, res, next) => {
  try {
    const { slug, description } = req.body;

    if (slug && description) {
      const topic = await insertTopic(slug, description);

      res.status(201).send({ topic });
    } else {
      next({ status: 400, msg: "Articles: Invalid slug or description" });
    }
  } catch (err) {
    next(err);
  }
};
