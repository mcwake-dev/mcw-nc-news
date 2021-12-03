const db = require("../db/connection");

exports.selectTopic = async (topic_name) => {
  const results = await db.query("SELECT * FROM topics WHERE slug = $1", [
    topic_name,
  ]);

  return results.rows[0];
};
exports.selectTopics = async () => {
  const results = await db.query("SELECT * FROM topics;");

  return results.rows;
};
exports.insertTopic = async (slug, description) => {
  const result = await db.query(
    "INSERT INTO topics(slug, description) VALUES ($1, $2) RETURNING *;",
    [slug, description]
  );

  return result.rows[0];
};
