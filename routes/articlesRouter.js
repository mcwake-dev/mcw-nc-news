const express = require("express");

const router = express.Router();
const {
  getArticle,
  getArticles,
  patchArticle,
  deleteArticle,
  postArticle,
  getArticleComments,
  postArticleComment,
  mostRecent,
} = require("../controllers/articles.controller");

router.route("/").get(getArticles).post(postArticle);
router.route("/recent").get(mostRecent);
router
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticle)
  .delete(deleteArticle);
router
  .route("/:article_id/comments")
  .get(getArticleComments)
  .post(postArticleComment);

module.exports = router;
