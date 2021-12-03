exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  switch (err.code) {
    case "22P02":
      res.status(400).send({ msg: "Invalid input" });
      break;
    case "23503":
      res.status(404).send({ msg: "Not Found" });
      break;
    default:
      next(err);
      break;
  }
};

exports.handleServerErrors = (err, req, res) => {
  console.log(err);

  // This would be really, really bad to have running in production
  // but is quite handy in development
  if (process.env.NODE_ENV === "development") {
    console.log("PARAMS", req.params);
    console.log("QUERY", req.query);
    console.log("BODY", req.body);
    console.log("URL", req.url);
  }

  res.status(500).send({ msg: "Internal Server Error" });
};
