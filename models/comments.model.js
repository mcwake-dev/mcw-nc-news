const db = require("../db/connection");

exports.deleteComment = async (comment_id) => {
  const result = await db.query("DELETE FROM comments WHERE comment_id = $1;", [
    comment_id,
  ]);

  return result.rowCount === 1;
};

exports.updateComment = async (comment_id, inc_votes) => {
  const result = await db.query(
    "UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;",
    [inc_votes, comment_id],
  );

  return result.rows[0];
};
