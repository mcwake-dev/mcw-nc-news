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
    [inc_votes, comment_id]
  );

  return result.rows[0];
};

exports.mostRecentComments = async () => {
  const result = await db.query(
    `SELECT comments.article_id, title, comment_id, comments.author, comments.votes, comments.created_at, comments.body 
     FROM comments INNER JOIN articles ON comments.article_id = articles.article_id
     ORDER BY comments.created_at DESC LIMIT 3;`
  );

  return result.rows;
};

exports.highestVotedComments = async () => {
  const result =
    await db.query(`SELECT comments.article_id, title, comment_id, comments.author, comments.votes, comments.created_at, comments.body 
  FROM comments INNER JOIN articles ON comments.article_id = articles.article_id
  ORDER BY comments.votes DESC LIMIT 3;`);

  return result.rows;
};
