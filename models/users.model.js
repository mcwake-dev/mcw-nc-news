const db = require("../db/connection");

exports.selectUsers = async () => {
  const results = await db.query(
    "SELECT username FROM users ORDER BY username;"
  );

  return results.rows;
};
