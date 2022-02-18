const db = require("../db/connection");

exports.selectUsers = async () => {
  const results = await db.query(
    `SELECT username, avatar_url, firstName, surname, 
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
    "SELECT username, avatar_url, firstName, surname, password FROM users WHERE username = $1 ORDER BY username;",
    [username]
  );

  return results.rows[0];
};

exports.createUser = async (
  username,
  firstName,
  surname,
  password,
  avatar_url
) => {
  const results = await db.query(
    "INSERT INTO users (username, firstname, surname, password, avatar_url) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
    [username, firstName, surname, password, avatar_url]
  );

  return results.rows[0];
};
