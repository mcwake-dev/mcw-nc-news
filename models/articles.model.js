const db = require("../db/connection");

exports.selectArticle = async (article_id) => {
  const results = await db.query(
    `
        SELECT articles.author, 
            articles.title, 
            articles.article_id, 
            articles.body, 
            articles.topic, 
            articles.created_at, 
            articles.votes, 
            COUNT(comment_id) AS comment_count
        FROM articles INNER JOIN comments on articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.author, 
                articles.title, 
                articles.article_id, 
                articles.body, 
                articles.topic, 
                articles.created_at, 
                articles.votes;
    `,
    [article_id]
  );

  return results.rows[0];
};
