const db = require("../db/connection");

exports.selectUsers = async () => {
  const results = await db.query(
    "SELECT username FROM users ORDER BY username;",
  );

  return results.rows;
};

exports.selectUser = async (username) => {
  const results = await db.query(
    "SELECT username, avatar_url, name FROM users WHERE username = $1;",
    [username],
  );

  return results.rows[0];
};
