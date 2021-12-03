const {
  expect,
  it,
  describe,
  beforeAll,
  afterAll,
  test,
} = require("@jest/globals");
const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

beforeAll(() => seed(testData));

afterAll(() => {
  if (db.end) db.end();
});

describe("GET /api/articles/:article_id", () => {
  it("should respond with a valid article object when passed a valid article ID", () =>
    request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            votes: 100,
            created_at: expect.any(String),
            comment_count: expect.any(String), // Returns BIGINT which has no equivalent in JS
          })
        );
      }));
  it("should respond with a 404 when passed a non-existent valid article ID", () =>
    request(app).get("/api/articles/999").expect(404));
  it("should respond with a 400 when passed an invalid article ID", () =>
    request(app).get("/api/articles/dave").expect(400));
});

describe("PATCH /api/articles/:article_id", () => {
  it("should respond with an updated article when passed a valid article ID and valid request body (positive)", () =>
    request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: 1,
      })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            votes: 101,
            created_at: expect.any(String),
          })
        );
      }));
  it("should respond with an updated article when passed a valid article ID and valid request body (negative)", () =>
    request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: -1,
      })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            votes: 100,
            created_at: expect.any(String),
          })
        );
      }));
  it("should respond with a 404 when passed a non-existent valid article ID", () =>
    request(app).patch("/api/articles/999").expect(404));
  it("should respond with a 400 when passed an invalid article ID", () =>
    request(app).patch("/api/articles/dave").expect(400));
  it("should respond with a 200 when passed a valid article ID but an invalid request body (key invalid)", () =>
    request(app).patch("/api/articles/1").send({ nernerner: 1 }).expect(200));
  it("should respond with a 200 when passed a valid article ID but an invalid request body (key valid, value invalid)", () =>
    request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "Wrongety Wrong Wrong" })
      .expect(400));
});

describe("GET /api/articles", () => {
  it("should return a list of articles", () =>
    request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBeGreaterThan(0);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
            })
          );
        });
        expect(articles).toBeSortedBy("created_at", { descending: true });
      }));
  describe("sort_by", () => {
    it("should be able return a list of articles sorted by author", () =>
      request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("author", { descending: true });
        }));
    it("should be able return a list of articles sorted by title", () =>
      request(app)
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("title", { descending: true });
        }));
    it("should be able return a list of articles sorted by topic", () =>
      request(app)
        .get("/api/articles?sort_by=topic")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("topic", { descending: true });
        }));
    it("should be able return a list of articles sorted by creation date", () =>
      request(app)
        .get("/api/articles?sort_by=created_at")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        }));
    it("should be able return a list of articles sorted by votes", () =>
      request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("votes", { descending: true });
        }));
    it("should be able return a list of articles sorted by comment count", () =>
      request(app)
        .get("/api/articles?sort_by=comment_count")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toEqual(
            articles.sort((a, b) => {
              if (a.comment_count !== b.comment_count) {
                return a.comment_count - b.comment_count;
              }
              return a.title.localeCompare(b.title);
            })
          );
        }));
    it("should throw an error if an invalid sort parameter is passed", () =>
      request(app)
        .get("/api/articles?sort_by=bananas")
        .expect(400)
        .then(({ body }) =>
          expect(body.msg).toEqual("Articles: Invalid sort parameter")
        ));
  });
  describe("order", () => {
    it("should sort articles in descending order by default", () =>
      request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(Array.isArray(articles)).toBe(true);
          expect(articles.length).toBeGreaterThan(0);
          expect(articles).toBeSortedBy("created_at", {
            descending: true,
          });
        }));
    it("should sort articles in descending order when requested", () =>
      request(app)
        .get("/api/articles?sort=desc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(Array.isArray(articles)).toBe(true);
          expect(articles.length).toBeGreaterThan(0);
          expect(articles).toBeSortedBy("created_at", {
            descending: true,
          });
        }));
    it("should sort articles in ascending order when requested", () =>
      request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(Array.isArray(articles)).toBe(true);
          expect(articles.length).toBeGreaterThan(0);
          expect(articles).toBeSortedBy("created_at", {
            ascending: true,
          });
        }));
    it("should throw an error if an invalid sort order parameter is passed", () =>
      request(app)
        .get("/api/articles?order=bizarre")
        .expect(400)
        .then(({ body }) =>
          expect(body.msg).toEqual("Articles: Invalid sort order parameter")
        ));
  });
  describe("topic", () => {
    it("should return a list of articles filtered by topic", () =>
      request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          body.articles.every((article) => article.topic === "cats");
        }));
    it("should return an error if the topic provided does not exist", () =>
      request(app)
        .get("/api/articles?topic=fweljkfaweljkfawejlkafwe")
        .expect(404));
    it("should return an empty array if the topic provided exists but has no articles", () =>
      request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(Array.isArray(articles)).toBe(true);
          expect(articles.length).toBe(0);
        }));
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  it("should return a list of comments for a valid article ID", () =>
    request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(Array.isArray(comments)).toBe(true);
        expect(comments.length).toBeGreaterThan(0);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: expect.any(Number),
            })
          );
        });
      }));
  it("should return a 404 for a non-existent article ID", () =>
    request(app).get("/api/articles/9999/comments").expect(404));
  it("should return a 200 and an empty array for an article with no comments", () =>
    request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(Array.isArray(comments)).toBe(true);
        expect(comments.length).toBe(0);
      }));
  it("should return a 400 error for invalid article ID", () =>
    request(app)
      .get("/api/articles/:bob/comments")
      .expect(400)
      .then(({ body }) => expect(body.msg).toBe("Invalid input")));
});

describe("POST /api/articles/:article_id/comments", () => {
  it("should create and return a new comment when passed a valid article ID, username and comment", () =>
    request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge", body: "A nice comment" })
      .expect(201)
      .then(({ body }) =>
        expect(body.comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            body: "A nice comment",
            votes: 0,
            author: "butter_bridge",
            article_id: 1,
            created_at: expect.any(String),
          })
        )
      ));
  it("should return a 400 error for invalid article ID", () =>
    request(app)
      .post("/api/articles/:bob/comments")
      .expect(400)
      .then(({ body }) =>
        expect(body.msg).toBe("Missing username or body for comment")
      ));
  it("should return an error when passed an invalid comment object (invalid keys)", () =>
    request(app)
      .post("/api/articles/1/comments")
      .send({ nanana: "sirnotappearinginthisapi", nernerner: "A nice comment" })
      .expect(400)
      .then(({ body }) =>
        expect(body.msg).toBe("Missing username or body for comment")
      ));
  it("should return an error when passed an invalid username", () =>
    request(app)
      .post("/api/articles/1/comments")
      .send({ username: "sirnotappearinginthisapi", body: "A nice comment" })
      .expect(404));
});

describe("DELETE /api/articles/:article_id", () => {
  it("should delete an article when supplied with a valid, existent article ID, returning a 204", () => {
    return db
      .query(
        "INSERT INTO articles (title, topic, author, body, created_at, votes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
        [
          "Living in the shadow of a great man",
          "mitch",
          "butter_bridge",
          "I find this existence challenging",
          new Date(1594329060000),
          100,
        ]
      )
      .then((result) => {
        const articleToDelete = result.rows[0];

        return request(app)
          .delete(`/api/articles/${articleToDelete.article_id}`)
          .expect(204);
      });
  });
  it("should return a 404 error if the article ID does not exist", () =>
    request(app).delete(`/api/articles/9999`).expect(404));
  it("should return a 400 error if an invalid article ID is supplied", () =>
    request(app).delete(`/api/articles/:blablabla`).expect(400));
});

describe("POST /api/articles", () => {
  test("should return a new article and a 201 when passed a valid new article object", () =>
    request(app)
      .post("/api/articles")
      .send({
        author: "icellusedkars",
        title: "A nice title",
        body: "A nice body (for an article)",
        topic: "cats",
      })
      .expect(201)
      .then(({ body: { article } }) =>
        expect(article).toEqual({
          article_id: expect.any(Number),
          author: "icellusedkars",
          title: "A nice title",
          body: "A nice body (for an article)",
          topic: "cats",
          created_at: expect.any(String),
          votes: 0,
        })
      ));
  test("should return a 400 error if required parameters are missing", () =>
    request(app)
      .post("/api/articles")
      .send({
        title: "A nice title",
        body: "A nice body (for an article)",
        topic: "cats",
      })
      .expect(400));
  test("should return a 404 error if user does not exist", () =>
    request(app)
      .post("/api/articles")
      .send({
        author: "sirnotappearinginthisapi",
        title: "A nice title",
        body: "A nice body (for an article)",
        topic: "cats",
      })
      .expect(404));
  test("should return a 404 error if topic does not exist", () =>
    request(app)
      .post("/api/articles")
      .send({
        author: "sirnotappearinginthisapi",
        title: "A nice title",
        body: "A nice body (for an article)",
        topic: "amagicalnonexistenttopic",
      })
      .expect(404));
});
