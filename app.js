const express = require("express");
const cors = require("cors");

const apiRouter = require("./routes/apiRouter");

const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors");
const { getEndpoints } = require("./controllers/api.controller");

const app = express();

app.use(cors());
app.use(express.json());

app.use(/^\/api$/, getEndpoints);
app.use("/api", apiRouter);
app.use("", (req, res, next) => next({ status: 404, msg: "Not found" }));
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
