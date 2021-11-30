const express = require("express");
const router = express.Router();
const {
  getArticle,
  getArticles,
  patchArticle,
} = require("../controllers/articles.controller");

router.route("/").get(getArticles);
router.route("/:article_id").get(getArticle).patch(patchArticle);

module.exports = router;
