const express = require("express");

const router = express.Router();
const {
  getArticle,
  getArticles,
  patchArticle,
  getArticleComments,
  postArticleComment,
} = require("../controllers/articles.controller");

router.route("/").get(getArticles);
router.route("/:article_id").get(getArticle).patch(patchArticle);
router
  .route("/:article_id/comments")
  .get(getArticleComments)
  .post(postArticleComment);

module.exports = router;
