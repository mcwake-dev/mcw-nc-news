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
        FROM articles LEFT JOIN comments on articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;
    `,
    [article_id]
  );

  return results.rows[0];
};

exports.selectArticles = async (
  sort_by = "created_at",
  order = "desc",
  topic = null,
  author = null
) => {
  const baseQuery = `
    SELECT articles.author, 
        articles.title, 
        articles.article_id, 
        articles.topic, 
        articles.created_at, 
        articles.votes, 
        COUNT(comment_id) AS comment_count
    FROM articles LEFT JOIN comments on articles.article_id = comments.article_id
    ${topic && author ? "WHERE topic = $1 AND articles.author = $2" : ""}
    ${topic && !author ? "WHERE topic = $1" : ""}
    ${author && !topic ? "WHERE articles.author = $1" : ""}
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order}, title ${order}
`;

  if (topic || author) {
    results = await db.query(
      baseQuery,
      [topic, author].filter((bind) => bind !== null)
    );
  } else {
    results = await db.query(baseQuery);
  }

  return results.rows;
};

exports.updateArticle = async (article_id, inc_votes) => {
  const results = await db.query(
    `
        UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;
    `,
    [inc_votes, article_id]
  );

  return results.rows[0];
};

exports.selectArticleComments = async (article_id) => {
  const results = await db.query(
    `
            SELECT comments.* 
            FROM comments 
            WHERE article_id = $1;
        `,
    [article_id]
  );

  return results.rows;
};

exports.insertArticleComment = async (article_id, author, body) => {
  const results = await db.query(
    `
    INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;
  `,
    [article_id, author, body]
  );

  return results.rows[0];
};

exports.deleteArticle = async (article_id) => {
  const result = await db.query(
    `
      DELETE FROM articles WHERE article_id = $1;
    `,
    [article_id]
  );

  return result.rowCount === 1;
};

exports.insertArticle = async (author, title, body, topic) => {
  const result = await db.query(
    `
    INSERT INTO articles (author, title, body, topic) VALUES ($1, $2, $3, $4) RETURNING *;
  `,
    [author, title, body, topic]
  );

  return result.rows[0];
};

exports.mostRecentArticles = async () => {
  const result = await db.query(
    `SELECT * FROM articles ORDER BY created_at DESC LIMIT 3;`
  );

  return result.rows;
};
