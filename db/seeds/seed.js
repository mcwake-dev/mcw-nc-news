const format = require("pg-format");
const db = require("../connection");

const seed = async (data, leaveEmpty) => {
  const {
    articleData, commentData, topicData, userData,
  } = data;
  // 1. create tables
  await db.query(`
    DROP TABLE IF EXISTS comments;
  `);
  await db.query(`
    DROP TABLE IF EXISTS articles;
  `);
  await db.query(`
    DROP TABLE IF EXISTS topics;
  `);
  await db.query(`
    DROP TABLE IF EXISTS users;
  `);
  await db.query(`
    CREATE TABLE topics (
      slug VARCHAR(50) NOT NULL PRIMARY KEY,
      description VARCHAR(255) NOT NULL
    );
  `);
  await db.query(`
    CREATE TABLE users (
      username VARCHAR(50) NOT NULL PRIMARY KEY,
      avatar_url VARCHAR(255) NOT NULL,
      name VARCHAR(100) NOT NULL
    );
  `);

  await db.query(`
    CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      body TEXT NOT NULL,
      votes INT DEFAULT 0,
      topic VARCHAR(50) NOT NULL,
      author VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT now(),
      FOREIGN KEY (topic) REFERENCES topics (slug) ON DELETE CASCADE,
      FOREIGN KEY (author) REFERENCES users (username) ON DELETE CASCADE
    )
  `);

  await db.query(`
    CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      author VARCHAR(50) NOT NULL,
      article_id INT NOT NULL,
      votes INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT now(),
      body TEXT NOT NULL,
      FOREIGN KEY (author) REFERENCES users(username) ON DELETE CASCADE,
      FOREIGN KEY (article_id) REFERENCES articles(article_id) ON DELETE CASCADE
    )
  `);

  if (!leaveEmpty) {
    await db.query(
      format(
        `
          INSERT INTO topics (slug, description) VALUES %L RETURNING slug, description;
        `,
        topicData.map(({ slug, description }) => [slug, description]),
      ),
    );
    await db.query(
      format(
        `
          INSERT INTO users (username, avatar_url, name) VALUES %L RETURNING *;
        `,
        userData.map(({ username, avatar_url, name }) => [
          username,
          avatar_url,
          name,
        ]),
      ),
    );
    await db.query(
      format(
        `
          INSERT INTO articles (title, body, topic, author, created_at, votes) VALUES %L RETURNING *;
        `,
        articleData.map(({
          title, body, topic, author, created_at, votes,
        }) => [
          title,
          body,
          topic,
          author,
          created_at,
          votes,
        ]),
      ),
    );
    await db.query(
      format(
        `
          INSERT INTO comments (author, article_id, votes, created_at, body) VALUES %L RETURNING *;
        `,
        commentData.map(({
          author, article_id, votes, created_at, body,
        }) => [
          author,
          article_id,
          votes,
          created_at,
          body,
        ]),
      ),
    );
  }
};

module.exports = seed;
