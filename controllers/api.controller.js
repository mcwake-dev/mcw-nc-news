const path = require("path");
const fs = require("fs").promises;
const log = require("../log");

exports.getEndpoints = async (req, res, next) => {
  const logger = log.getLogger("API Controller > getEndpoints");
  const filePath = path.join(__dirname, "../endpoints.json");

  fs.readFile(filePath)
    .then((file) => {
      logger.log("Sending endpoints file to client");
      res.status(200).send(file);
    })
    .catch((err) => {
      logger.error(`Error occured while reading endpoints file: ${err}`);
      next(err);
    });
};
