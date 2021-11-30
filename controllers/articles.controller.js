const { selectArticle } = require("../models/articles.model");

exports.getArticle = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const article = await selectArticle(article_id);

    if (article) {
      res.status(200).send({ article });
    } else {
      next({ status: 404, msg: "Not found" });
    }
  } catch (err) {
    next(err);
  }
};
