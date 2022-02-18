const devData = require("../data/development-data");
const seed = require("./seed");
const db = require("../connection");

const runSeed = () =>
  seed(devData)
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      db.end();
    });

runSeed();
