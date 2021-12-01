const {
  selectArticle,
  selectArticles,
  updateArticle,
  selectArticleComments,
  insertArticleComment,
} = require("../models/articles.model");
const { selectTopic } = require("../models/topics.model");

exports.getArticle = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const article = await selectArticle(article_id);

    if (article) {
      res.status(200).send({ article });
    } else {
      next({ status: 404, msg: "Articles: Article not found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.getArticles = async (req, res, next) => {
  try {
    const { sort_by, order, topic } = req.query;
    const topic_slug = await selectTopic(topic);

    if (!topic || (topic && topic_slug)) {
      const articles = await selectArticles(sort_by, order, topic);

      if (articles.length > 0) {
        res.status(200).send({ articles });
      } else {
        next({ status: 204, msg: "No articles to display" });
      }
    } else {
      next({ status: 400, msg: "Articles: Invalid topic" });
    }
  } catch (err) {
    switch (err.message) {
      case "Articles: Invalid sort parameter":
      case "Articles: Invalid sort order parameter":
        next({ status: 400, msg: err.message });
        break;
      default:
        next(err);
        break;
    }
  }
};

exports.patchArticle = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
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

exports.getArticleComments = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const comments = await selectArticleComments(article_id);

    if (comments.length > 0) {
      res.status(200).send({ comments });
    } else {
      next({ status: 204, msg: "Articles: No comments found for article" });
    }
  } catch (err) {
    next(err);
  }
};

exports.postArticleComment = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const { username, body } = req.body;

    const comment = await insertArticleComment(article_id, username, body);

    res.status(200).send({ comment });
  } catch (err) {
    next(err);
  }
};
