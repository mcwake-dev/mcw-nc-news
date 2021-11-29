const db = require("../connection");
const seed = async (data) => {
  const { articleData, commentData, topicData, userData } = data;
  // 1. create tables
  await db.query(`
    DROP TABLE IF EXISTS comments;
    DROP TABLE IF EXISTS articles;
    DROP TABLE IF EXISTS topics;
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
    DROP TABLE IF EXISTS articles;
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

  // 2. insert data
};

module.exports = seed;
