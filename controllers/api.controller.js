const path = require("path");
const fs = require("fs").promises;

exports.getEndpoints = async (req, res, next) => {
  const filePath = path.join(__dirname, "../endpoints.json");

  fs.readFile(filePath)
    .then((file) => {
      res.status(200).send(file);
    })
    .catch((err) => {
      next(err);
    });
};
