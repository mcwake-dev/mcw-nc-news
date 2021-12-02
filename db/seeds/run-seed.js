const devData = require("../data/development-data");
const seed = require("./seed");
const db = require("../connection");

const runSeed = () => seed(devData).then(() => db.end());

runSeed();
