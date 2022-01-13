const db = require("../db/connection");

exports.selectUsers = async () => {
  const results = await db.query(
    `SELECT username, avatar_url, name, 
    (SELECT COUNT(*) FROM articles WHERE articles.author = users.username) AS articlecount, 
    (SELECT SUM(votes) FROM articles WHERE articles.author = users.username) AS articlevotes, 
    (SELECT COUNT(*) FROM comments WHERE comments.author = users.username) AS commentcount, 
    (SELECT SUM(votes) FROM comments WHERE comments.author = users.username) AS commentvotes 
    FROM users ORDER BY username;`
  );

  return results.rows;
};

exports.selectUser = async (username) => {
  const results = await db.query(
    "SELECT username, avatar_url, name FROM users WHERE username = $1 ORDER BY username;",
    [username]
  );

  return results.rows[0];
};
