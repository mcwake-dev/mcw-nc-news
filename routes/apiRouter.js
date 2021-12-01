const express = require("express");
const apiRouter = express.Router();

const { getEndpoints } = require("../controllers/api.controller");
const articlesRouter = require("./articlesRouter");
const commentsRouter = require("./commentsRouter");
const topicsRouter = require("./topicsRouter");
const usersRouter = require("./usersRouter");

apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use(/^\/$/, getEndpoints);

module.exports = apiRouter;
