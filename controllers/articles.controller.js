const {
  selectArticle,
  selectArticles,
  updateArticle,
  selectArticleComments,
  insertArticleComment,
  deleteArticle,
  insertArticle,
} = require("../models/articles.model");
const { selectTopic } = require("../models/topics.model");
const { selectUser } = require("../models/users.model");

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
    const allowedSorts = [
      "title",
      "topic",
      "created_at",
      "votes",
      "comment_count",
      "author",
    ];
    const allowedSortOrder = ["desc", "asc"];

    if (sort_by && !allowedSorts.includes(sort_by)) {
      next({ status: 400, msg: "Articles: Invalid sort parameter" });
    } else if (order && !allowedSortOrder.includes(order)) {
      next({ status: 400, msg: "Articles: Invalid sort order parameter" });
    } else {
      let topicExists;

      if (topic) {
        topicExists = await selectTopic(topic);
      }

      if (topicExists || !topic) {
        const articles = await selectArticles(sort_by, order, topic);

        res.status(200).send({ articles });
      } else {
        next({ status: 404, msg: "Articles: Topic not found" });
      }
    }
  } catch (err) {
    next(err);
  }
};

exports.patchArticle = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    const articleExists = await selectArticle(article_id);

    if (articleExists) {
      if (inc_votes) {
        const article = await updateArticle(article_id, inc_votes);

        res.status(200).send({ article });
      } else {
        res.sendStatus(200);
      }
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
    const articleExists = await selectArticle(article_id);

    if (articleExists) {
      const comments = await selectArticleComments(article_id);

      res.status(200).send({ comments });
    } else {
      next({ status: 404, msg: "Article not found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.postArticleComment = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const { username, body } = req.body;
    if (username && body) {
      const comment = await insertArticleComment(article_id, username, body);

      res.status(201).send({ comment });
    } else {
      next({ status: 400, msg: "Missing username or body for comment" });
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteArticle = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const articleDeleted = await deleteArticle(article_id);

    if (articleDeleted) {
      res.sendStatus(204);
    } else {
      next({ status: 404, msg: "Article not found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.postArticle = async (req, res, next) => {
  try {
    const { author, title, body, topic } = req.body;

    if (author && title && body && topic) {
      const article = await insertArticle(author, title, body, topic);

      res.status(201).send({ article });
    } else {
      next({ status: 400, msg: "Missing required parameters" });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};
