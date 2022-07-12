const Parser = require("rss-parser");
const parser = new Parser();

const getGithubUrl = (projectName) =>
  `https://github.com/mcwake-dev/${projectName}/commits.atom`;

exports.getCommits = async (req, res, next) => {
  try {
    const { project_name } = req.params;
    const feed = await parser.parseURL(getGithubUrl(project_name));

    res
      .status(200)
      .send({ feed: feed.items.filter((item, index) => index < 10) });
  } catch (err) {
    next({ msg: `Error while retrieving feed: ${err.message}`, status: 400 });
  }
};
