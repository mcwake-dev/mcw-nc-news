const express = require("express");
const router = express.Router();
const {
  getArticle,
  patchArticle,
} = require("../controllers/articles.controller");

router.route("/:article_id").get(getArticle).patch(patchArticle);

module.exports = router;
