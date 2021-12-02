const express = require("express");
const apiRouter = require("./routes/apiRouter");

const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors/index.js");
const { getEndpoints } = require("./controllers/api.controller");

const app = express();

app.use(express.json());

app.use(/^\/api$/, getEndpoints);
app.use("/api", apiRouter);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
