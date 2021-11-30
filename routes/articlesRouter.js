const express = require("express");
const router = express.Router();
const { getArticle } = require("../controllers/articles.controller");

router.route("/:article_id").get(getArticle);
module.exports = router;
