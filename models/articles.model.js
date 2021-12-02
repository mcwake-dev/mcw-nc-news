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
    [article_id],
  );

  return results.rows[0];
};

exports.selectArticles = async (
  sort_by = "created_at",
  order = "desc",
  topic = null,
) => {
  let results;
  let sort_by_query;
  let order_query;
  const allowedSorts = [
    "title",
    "topic",
    "created_at",
    "votes",
    "comment_count",
  ];
  const allowedSortOrder = ["desc", "asc"];

  if (allowedSorts.includes(sort_by)) {
    sort_by_query = `ORDER BY ${sort_by}`;
  } else {
    throw new Error("Articles: Invalid sort parameter");
  }

  if (allowedSortOrder.includes(order)) {
    order_query = order;
  } else {
    throw new Error("Articles: Invalid sort order parameter");
  }

  const baseQuery = `
    SELECT articles.author, 
        articles.title, 
        articles.article_id, 
        articles.body, 
        articles.topic, 
        articles.created_at, 
        articles.votes, 
        COUNT(comment_id) AS comment_count
    FROM articles INNER JOIN comments on articles.article_id = comments.article_id
    ${topic ? "WHERE topic = $1" : ""}
    GROUP BY articles.author, 
            articles.title, 
            articles.article_id, 
            articles.body, 
            articles.topic, 
            articles.created_at, 
            articles.votes
    ${sort_by_query}
    ${order_query}, title
`;

  if (topic) {
    results = await db.query(baseQuery, [topic]);
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
    [inc_votes, article_id],
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
    [article_id],
  );

  return results.rows;
};

exports.insertArticleComment = async (article_id, author, body) => {
  const results = await db.query(
    `
    INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;
  `,
    [article_id, author, body],
  );

  return results.rows[0];
};
