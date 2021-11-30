const { selectArticle, updateArticle } = require("../models/articles.model");

exports.getArticle = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const article = await selectArticle(article_id);

    if (article) {
      res.status(200).send({ article });
    } else {
      next({ status: 404, msg: "Article not found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.patchArticle = async (req, res, next) => {
  let { article_id } = req.params;
  let { inc_votes } = req.body;

  try {
    const article = await updateArticle(article_id, inc_votes);

    if (article) {
      res.status(200).send({ article });
    } else {
      next({ status: 404, msg: "Article not found" });
    }
  } catch (err) {
    next(err);
  }
};
